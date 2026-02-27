'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CloudIcon } from '@/shared/assets/icons'
import { ClipSuccessModal } from '@/shared/components/clip-success-modal'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { Paper } from '@/shared/components/ui/paper'
import { Switch } from '@/shared/components/ui/switch'
import { TextField } from '@/shared/components/ui/text-field'
import { TextFieldArea } from '@/shared/components/ui/text-field-area'
import { useCreateClip } from '@/shared/hooks'

const formSchema = z
  .object({
    type: z.enum(['text', 'file', 'code']),
    title: z.string().min(1, 'عنوان الزامی است'),
    content: z.string().min(5, 'توضیحات باید حداقل ۵ کاراکتر باشد'),
    expiration: z.string().min(1, 'لطفاً تاریخ انقضاء را انتخاب کنید'),
    hasPassword: z.boolean(),
    password: z.string().optional(),
    isOneTime: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.hasPassword && (!data.password || data.password.length < 4)) {
        return false
      }
      return true
    },
    {
      message: 'رمز عبور باید حداقل ۴ کاراکتر باشد',
      path: ['password'],
    }
  )

type FormValues = z.infer<typeof formSchema>

export const ClipForm = () => {
  const [successData, setSuccessData] = useState<{
    code: string
    id: string
  } | null>(null)
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'text',
      title: '',
      content: '',
      expiration: '24h',
      hasPassword: false,
      password: '',
      isOneTime: false,
    },
  })

  const { mutateAsync, isPending } = useCreateClip()
  const hasPasswordEnabled = watch('hasPassword')
  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await mutateAsync(data)
      if (response.success) {
        setSuccessData({ code: response.code, id: response.id })
      }
    } catch (error) {
      console.error(error)
    }
  })

  const handleCloseModal = () => {
    setSuccessData(null)
    reset() // فرم را برای ایجاد کلیپ بعدی پاک کن
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex h-full flex-col gap-y-2">
        <Paper className="grid gap-y-4">
          <TextField
            label="عنوان متن"
            {...register('title')}
            error={errors.title?.message}
          />
          <TextFieldArea
            label="توضیحات"
            fieldClassName="min-h-32 max-h-32"
            {...register('content')}
            error={errors.content?.message}
          />
          <div className="grid gap-y-2">
            <Label>تاریخ انقضاء</Label>
            <Controller
              name="expiration"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب تاریخ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30m">۳۰ دقیقه</SelectItem>
                    <SelectItem value="1h">۱ ساعت</SelectItem>
                    <SelectItem value="24h">۲۴ ساعت</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.expiration && (
              <p className="text-[10px] text-red-500">
                {errors.expiration.message}
              </p>
            )}
          </div>
        </Paper>
        <Paper className="grid gap-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="haspass">کلمه عبور؟</Label>
            <Controller
              name="hasPassword"
              control={control}
              render={({ field }) => (
                <Switch
                  id="haspass"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          {hasPasswordEnabled && (
            <div className="fade-in slide-in-from-top-2 animate-in duration-300">
              <TextField
                type="text"
                label="رمز عبور را وارد کنید"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="onetime">حالت یکبار مصرف؟</Label>
            <Controller
              name="isOneTime"
              control={control}
              render={({ field }) => (
                <Switch
                  id="onetime"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </Paper>
        <Paper className="mt-auto">
          <Button type="submit" className="w-full" disabled={isPending}>
            همگام سازی
            <CloudIcon className="mr-2" />
          </Button>
        </Paper>
      </form>
      <ClipSuccessModal
        data={successData}
        isOpen={!!successData}
        onClose={handleCloseModal}
      />
    </>
  )
}
