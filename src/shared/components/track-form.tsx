'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { parseAsString, useQueryState } from 'nuqs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { LoaderIcon } from '@/shared/assets/icons'
import { TrackClipModal } from '@/shared/components/track-modal'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Paper } from '@/shared/components/ui/paper'

const trackSchema = z.object({
  code: z
    .string()
    .length(6, 'کد باید دقیقاً ۶ رقم باشد')
    .regex(/^\d+$/, 'فقط عدد وارد کنید'),
  password: z.string().optional(),
})

type TrackValues = z.infer<typeof trackSchema>

export const TrackForm = () => {
  const [trackData, setTrackData] = useState(null)
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
      const res = await fetch('/api/clip/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
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
      if (result.success) {
        setTrackData(result.data)
        setRequiresPassword(false)
        setQueryCode(values.code)
      }
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper className="grid gap-y-3">
          {!requiresPassword ? (
            <Input
              maxLength={6}
              autoComplete="off"
              inputMode="numeric"
              placeholder="کد 6 رقمی رهگیری را وارد کنید"
              className="ltr text-center font-semibold text-base tracking-[0.5em]"
              {...register('code')}
            />
          ) : (
            <Input
              autoFocus
              type="password"
              placeholder="رمز عبور را وارد کنید"
              className="ltr text-center font-semibold text-base tracking-[0.5em]"
              {...register('password')}
            />
          )}
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={
              isPending || (!requiresPassword && watch('code')?.length !== 6)
            }
          >
            {isPending ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : requiresPassword ? (
              'تایید رمز عبور'
            ) : (
              'بررسی کد رهگیری'
            )}
          </Button>
          {requiresPassword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRequiresPassword(false)
                reset({ code: getValues('code'), password: '' })
              }}
            >
              بازگشت
            </Button>
          )}
        </Paper>
      </form>
      <TrackClipModal
        isOpen={!!trackData}
        data={trackData}
        onClose={() => {
          setTrackData(null)
          setQueryCode(null)
          reset()
        }}
      />
    </>
  )
}
