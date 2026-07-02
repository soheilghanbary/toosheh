'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { VisuallyHidden } from 'radix-ui'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { client } from 'server/lib/orpc.client'
import { ClipboardUpload } from 'shared/components/clipboard-upload'
import { SuccessModal } from 'shared/components/success-modal'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'shared/components/ui/alert-dialog'
import * as z from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import { TextField } from '@/shared/components/ui/text-field'
import { TextFieldArea } from '@/shared/components/ui/text-field-area'

const formSchema = z
  .object({
    description: z.string(),
    files: z.array(z.string()).default([]),
    expiration: z.string(),
    hasPassword: z.boolean(),
    password: z.string().optional(),
    isOneTime: z.boolean(),
  })
  .refine(
    (data) => !data.hasPassword || (data.password && data.password.length >= 4),
    { message: 'رمز عبور باید حداقل ۴ کاراکتر باشد', path: ['password'] }
  )

type FormValues = z.infer<typeof formSchema>

export const ClipboardForm = () => {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState<string | null>(null)
  const _router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      files: [],
      expiration: '30m', // اصلاح شد: هماهنگ با گزینه‌های Select
      hasPassword: false,
      password: '',
      isOneTime: false,
    },
  })

  const { mutateAsync, isPending } = useMutation(
    client.clip.createClip.mutationOptions()
  )
  const hasPasswordEnabled = watch('hasPassword')
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await mutateAsync(data)
      if (res.success) {
        setCode(res.code)
        setOpen(true)
      }
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-md flex-col gap-y-6"
      >
        <TextFieldArea
          label="متن"
          {...register('description')}
          error={errors.description?.message}
          fieldClassName="min-h-32 max-h-32"
        />
        <Controller
          name="files"
          control={control}
          render={({ field }) => (
            <ClipboardUpload value={field.value} onChange={field.onChange} />
          )}
        />
        <div className="grid gap-y-2">
          <Label>تاریخ انقضاء</Label>
          <Controller
            name="expiration"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب تاریخ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30m">۳۰ دقیقه</SelectItem>
                  <SelectItem value="1h">۱ ساعت</SelectItem>
                  <SelectItem value="12h">۱۲ ساعت</SelectItem>
                  <SelectItem value="24h">۲۴ ساعت</SelectItem>
                  <SelectItem value="3d">۳ روز</SelectItem>
                  <SelectItem value="7d">۷ روز</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
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
          <Label htmlFor="onetime">حالت یکبار مصرف?</Label>
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
        <Button type="submit" className="w-full" disabled={isPending}>
          همگام سازی
        </Button>
      </form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="default" className="p-0">
          <VisuallyHidden.Root>
            <AlertDialogHeader>
              <AlertDialogTitle />
              <AlertDialogDescription />
            </AlertDialogHeader>
          </VisuallyHidden.Root>
          {code && <SuccessModal code={code} />}
          <div className="p-4">
            <Button
              className="w-full"
              variant={'secondary'}
              onClick={() => setOpen(false)}
            >
              بستن
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
