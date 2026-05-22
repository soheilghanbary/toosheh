'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { parseAsString, useQueryState } from 'nuqs'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Clip } from 'server/db/schema'
import { Separator } from 'shared/components/ui/separator'
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

  const { register, handleSubmit, reset, watch, getValues } =
    useForm<TrackValues>({
      resolver: zodResolver(trackSchema),
      defaultValues: { code: queryCode, password: '' },
    })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: TrackValues) => {
      const res = await fetch(`/api/clips/${values.code}`)
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'یافت نشد')
      return result
    },
  })

  const onSubmit = async (values: TrackValues) => {
    try {
      const result = await mutateAsync(values)
      if (result.requiresPassword) {
        setRequiresPassword(true)
        return
      }
      setTrackData(result)
      setRequiresPassword(false)
      setQueryCode(values.code)
    } catch (err: any) {
      if (requiresPassword) {
        toast.error('رمز عبور وارد شده نادرست است')
        reset({ ...getValues(), password: '' }) // پاک کردن فیلد رمز برای تلاش مجدد
      } else {
        toast.error(err.message || 'کد منقضی شده یا یافت نشد')
        setQueryCode(null)
      }
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex h-full max-w-md flex-col gap-y-4 rounded-xl bg-muted/40 p-6"
      >
        <h1 className="font-semibold">جستجوی کلیپ برد</h1>
        <div className="flex items-center gap-2">
          <Input
            maxLength={6}
            autoComplete="off"
            inputMode="numeric"
            placeholder="کد 6 رقمی رهگیری را وارد کنید"
            className="ltr flex-1 rounded-md text-center font-semibold text-base tracking-[0.5em]"
            {...register('code')}
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={isPending || watch('code')?.length !== 6}
            className="rounded-md"
          >
            {isPending ? <LoaderIcon /> : <SearchIcon />}
            جستجو
          </Button>
        </div>
      </form>
      {trackData && (
        <main className="mx-auto mt-4 max-w-md space-y-4 rounded-xl bg-muted/40 p-6">
          <div className="rounded-2xl border bg-card p-4">
            <p className="font-medium text-sm">{trackData.title}</p>
            <Separator className="my-4" />
            <p className="max-h-32 overflow-y-auto whitespace-pre-wrap break-all text-muted-foreground text-xs/5 ltr:text-left rtl:text-right">
              {trackData.description ? trackData.description : 'بدون توضیحات'}
            </p>
          </div>
          <Button
            className="w-full"
            variant="default"
            onClick={() => {
              navigator.clipboard.writeText('data.content')
              toast('محتوا کپی شد')
            }}
          >
            <CopyIcon />
            کپی کردن متن
          </Button>
          {trackData.files.length && (
            <div className="grid gap-y-2">
              <p>فایل ها</p>
              <div className="flex flex-wrap items-center gap-x-2">
                {trackData.files.map((v, i) => (
                  <a
                    href={v}
                    target="_blank"
                    rel="noreferrer"
                    key={v}
                    className="flex items-center justify-center gap-x-2 rounded-md border border-primary/10 bg-primary/10 p-2 text-primary"
                  >
                    <FileIcon className="size-5" />
                    <p className="font-medium text-xs">فایل ({i + 1})</p>
                  </a>
                ))}
              </div>
            </div>
          )}
          {/* <div className="grid gap-y-2">
                      <Label>محتوا</Label>
                      {(
                        <>
                          <p className="max-h-32 overflow-y-auto whitespace-pre-wrap break-all rounded-md border p-3 text-muted-foreground text-xs/5 ltr:text-left rtl:text-right">
                            {data.content.value}
                          </p>
                          <Button
                            className="w-full"
                            variant="default"
                            onClick={() => {
                              navigator.clipboard.writeText(data.content)
                              toast('محتوا کپی شد')
                            }}
                          >
                            <CopyIcon />
                            کپی کردن متن
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-wrap items-center gap-x-2">
                          {data.content.value.map((v, i) => (
                            <a
                              href={v}
                              target="_blank"
                              rel="noreferrer"
                              key={v}
                              className="flex items-center justify-center gap-x-2 rounded-md border border-primary/10 bg-primary/5 p-2 text-primary"
                            >
                              <FileIcon className="size-5" />
                              <p className="font-medium text-xs">فایل ({i + 1})</p>
                            </a>
                          ))}
                        </div>
                      )}
                    </div> */}
          <p className="mt-4 text-center font-medium text-sm/5">
            اطلاعات کلیپ برد
          </p>
          <ul className="grid text-foreground/75 text-xs [&>li]:border-b [&>li]:py-3">
            <li>کد رهگیری: {trackData.code}</li>
            <li>حالت یکبار مصرف: {trackData.isOneTime ? 'فعال' : 'غیرفعال'}</li>
            <li>تعداد مشاهده شده: {trackData.views ?? 0}</li>
            <li>
              تاریخ ثبت کلیپ برد:{' '}
              {new Date(trackData.createdAt).toLocaleString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // اگر ساعت ۲۴ ساعته می‌خواهی این را بگذار، اگر ۱۲ ساعته (ق.ظ/ب.ظ) می‌خواهی حذفش کن یا true بذار
              })}
            </li>
            <li>
              انقضاء کلیپ برد:{' '}
              {new Date(trackData.expiresAt).toLocaleString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // اگر ساعت ۲۴ ساعته می‌خواهی این را بگذار، اگر ۱۲ ساعته (ق.ظ/ب.ظ) می‌خواهی حذفش کن یا true بذار
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
