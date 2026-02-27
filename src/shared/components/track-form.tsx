'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
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
  const { register, handleSubmit, reset, watch } = useForm<TrackValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: { code: '' },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: TrackValues) => {
      const res = await fetch('/api/clip/track', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'خطایی رخ داده است')
      return result
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await mutateAsync(data)
      if (result.success) setTrackData(result.data)
    } catch (_err) {
      toast.error('کد منقضی شده یا یافت نشد')
    }
  })

  return (
    <>
      <form onSubmit={onSubmit}>
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
          reset() // پاک کردن فرم بعد از بستن مدال
        }}
      />
    </>
  )
}
