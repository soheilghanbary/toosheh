'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TrackClipModal } from '@/shared/components/track-modal'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Paper } from '@/shared/components/ui/paper'

const trackSchema = z.object({
  code: z
    .string()
    .length(6, 'کد باید دقیقاً ۶ رقم باشد')
    .regex(/^\d+$/, 'فقط عدد وارد کنید'),
})

type TrackValues = z.infer<typeof trackSchema>

export const TrackForm = () => {
  const [trackData, setTrackData] = useState(null)
  const [queryCode, setQueryCode] = useQueryState(
    'code',
    parseAsString.withDefault('').withOptions({ shallow: true })
  )
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<TrackValues>({
      resolver: zodResolver(trackSchema),
      defaultValues: { code: queryCode },
    })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch('/api/clip/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'یافت نشد')
      return result
    },
  })

  const onSubmit = async (values: TrackValues) => {
    try {
      const result = await mutateAsync(values.code)
      if (result.success) {
        setTrackData(result.data)
        // همگام‌سازی URL با کد وارد شده
        setQueryCode(values.code)
      }
    } catch (_err) {
      toast.error('کد منقضی شده یا یافت نشد')
      setQueryCode(null) // پاک کردن URL در صورت خطا
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper className="grid gap-y-3">
          <Input
            maxLength={6}
            autoComplete="off"
            inputMode="numeric"
            placeholder="کد 6 رقمی رهگیری را وارد کنید"
            className="ltr text-center font-semibold text-base tracking-[0.5em]"
            {...register('code')}
          />
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={isPending || watch('code')?.length !== 6}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            بررسی کد رهگیری
          </Button>
        </Paper>
      </form>
      <TrackClipModal
        isOpen={!!trackData}
        data={trackData}
        onClose={() => {
          setTrackData(null)
          setQueryCode(null) // پاک کردن کد از URL هنگام بستن
          reset()
        }}
      />
    </>
  )
}
