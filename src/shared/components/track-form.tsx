'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { parseAsString, useQueryState } from 'nuqs'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Clip } from 'server/db/schema'
import { client } from 'server/lib/orpc.client'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  CopyIcon,
  FileIcon,
  LoaderIcon,
  SearchIcon,
} from '@/shared/assets/icons'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'

const trackSchema = z.object({
  code: z
    .string()
    .length(6, 'کد باید دقیقاً ۶ رقم باشد')
    .regex(/^\d+$/, 'فقط عدد وارد کنید'),
  password: z.string().optional(),
})

type TrackValues = z.infer<typeof trackSchema>

export const TrackForm = () => {
  const [trackData, setTrackData] = useState<Clip | null>(null)
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [queryCode, setQueryCode] = useQueryState(
    'code',
    parseAsString.withDefault('').withOptions({ shallow: true })
  )

  const { register, handleSubmit, watch } = useForm<TrackValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: { code: queryCode, password: '' },
  })

  const { mutateAsync, isPending } = useMutation(
    client.clip.getClip.mutationOptions()
  )

  const onSubmit = async (values: TrackValues) => {
    try {
      const result = await mutateAsync(values)
      if (result.requiresPassword) {
        setRequiresPassword(true)
        toast.error('رمز عبور لازم است')
        return
      }
      setTrackData(result)
      setRequiresPassword(false)
      setQueryCode(null)
    } catch (err: any) {
      toast.error(err.message)
      setTrackData(null)
      setQueryCode(null)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex h-full max-w-md flex-col gap-y-4 rounded-xl bg-muted/40 p-4"
      >
        <div className="flex items-center gap-2">
          <Input
            maxLength={6}
            autoComplete="off"
            inputMode="numeric"
            placeholder="کد 6 رقمی رهگیری"
            className="ltr flex-1 rounded-md text-center font-semibold text-sm tracking-[0.5em]"
            {...register('code')}
          />
          <Button
            type="submit"
            variant={requiresPassword ? 'default' : 'outline'}
            disabled={isPending || watch('code')?.length !== 6}
            className="rounded-md"
          >
            {isPending ? <LoaderIcon /> : <SearchIcon />}
            {requiresPassword ? 'تایید رمز' : 'جستجو'}
          </Button>
        </div>
        {requiresPassword && (
          <Input
            maxLength={6}
            autoComplete="off"
            inputMode="numeric"
            placeholder="رمز عبور "
            className="ltr flex-1 rounded-md text-center font-semibold text-sm tracking-[0.5em]"
            {...register('password')}
          />
        )}
      </form>
      {trackData && (
        <main className="mx-auto mt-8 max-w-md space-y-4 rounded-xl">
          <div className="rounded-xl border bg-card p-4">
            <p className="mb-2 text-sm">متن</p>
            <p className="max-h-32 overflow-y-auto whitespace-pre-wrap break-all text-muted-foreground text-xs/5 ltr:text-left rtl:text-right">
              {trackData.description}
            </p>
          </div>
          <Button
            className="w-full"
            variant="default"
            onClick={() => {
              navigator.clipboard.writeText(trackData.description!)
              toast('محتوا کپی شد')
            }}
          >
            <CopyIcon />
            کپی کردن متن
          </Button>
          {Boolean(trackData.files.length) && (
            <div className="grid gap-y-2">
              <p>فایل ها</p>
              <div className="flex flex-wrap items-center gap-x-2">
                {trackData.files.map((v, i) => (
                  <a
                    href={v}
                    target="_blank"
                    rel="noreferrer"
                    key={v}
                    className="flex items-center justify-center gap-x-2 rounded-md border border-primary/10 bg-primary/10 p-2 text-primary dark:bg-primary/20 dark:text-cyan-400"
                  >
                    <FileIcon className="size-5" />
                    <p className="font-medium text-xs">فایل ({i + 1})</p>
                  </a>
                ))}
              </div>
            </div>
          )}
          <p className="text-center font-medium text-sm/5">اطلاعات کلیپ بورد</p>
          <ul className="grid text-foreground/75 text-xs [&>li]:border-b [&>li]:py-3">
            <li>کد رهگیری: {trackData.code}</li>
            <li>حالت یکبار مصرف: {trackData.isOneTime ? 'فعال' : 'غیرفعال'}</li>
            <li>تعداد مشاهده شده: {trackData.views ?? 0}</li>
            <li>
              تاریخ ثبت کلیپ بورد:{' '}
              {new Date(trackData.createdAt).toLocaleString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </li>
            <li>
              انقضاء کلیپ بورد:{' '}
              {new Date(trackData.expiresAt).toLocaleString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </li>
          </ul>
          <div className="flex flex-col items-center gap-y-2 py-2">
            <QRCodeSVG
              size={150}
              value={`${window.location.origin}/track?code=${trackData.code}`}
              bgColor="var(--card)"
              fgColor="var(--foreground)"
            />
            <p className="text-center text-muted-foreground text-tiny">
              کد QR ایجاد شده را اسکن کنید
            </p>
          </div>
        </main>
      )}
    </>
  )
}
