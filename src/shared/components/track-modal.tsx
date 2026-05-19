'use client'
import {
  AnimatePresence,
  motion,
  useIsomorphicLayoutEffect,
} from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { CopyIcon, FileIcon } from '@/shared/assets/icons'
import { AppHeader } from '@/shared/components/app-header'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { Paper } from '@/shared/components/ui/paper'
import { TextField } from '@/shared/components/ui/text-field'

interface Props {
  isOpen: boolean
  data: any | null // دیتایی که از سمت TrackForm می‌آید
  onClose: () => void
}

const MODAL_VARIANTS = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
}

export const TrackClipModal = ({ isOpen, data, onClose }: Props) => {
  // جلوگیری از اسکرول Body (Scroll Lock)
  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])

  const shareLink = data ? `https://toosheh.vercel.app/track/${data.code}` : ''

  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.section
          variants={MODAL_VARIANTS.overlay}
          initial="initial"
          animate="animate"
          exit="exit"
          className="sm:container-sm fixed inset-0 z-50 flex size-full flex-col overflow-y-auto bg-background"
        >
          <AppHeader title={`رهگیری کلیپ برد: ${data.code}#`} hideBackButton />
          <main className="mt-2 flex flex-col gap-y-2">
            <Paper>
              <TextField label="عنوان متن" value={data.title} readOnly />
              <div className="grid gap-y-2">
                <Label>محتوا</Label>
                {data.type === 'text' ? (
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
              </div>
            </Paper>
            <Paper>
              <p className="text-center font-medium text-sm/5">
                اطلاعات کلیپ برد
              </p>
              <ul className="grid text-foreground/75 text-xs [&>li]:border-b [&>li]:py-3">
                <li>نوع کلیپ برد: {data.type === 'text' ? 'متنی' : 'فایل'}</li>
                <li>کد رهگیری: {data.code}</li>
                <li>حالت یکبار مصرف: {data.isOneTime ? 'فعال' : 'غیرفعال'}</li>
                <li>تعداد مشاهده شده: {data.views ?? 0}</li>
                <li>
                  تاریخ ثبت کلیپ برد:{' '}
                  {new Date(data.createdAt).toLocaleDateString('fa-IR')}
                </li>
                <li>
                  انقضاء کلیپ برد:{' '}
                  {new Date(data.expiresAt).toLocaleDateString('fa-IR')}
                </li>
              </ul>
              <div className="flex flex-col items-center gap-y-2 py-2">
                <QRCodeSVG
                  size={120}
                  value={shareLink}
                  bgColor="var(--card)"
                  fgColor="var(--foreground)"
                />
                <p className="text-center text-muted-foreground text-tiny">
                  کد QR ایجاد شده را اسکن کنید
                </p>
              </div>
            </Paper>
            <Paper>
              <Button onClick={onClose} variant={'secondary'}>
                بستن
              </Button>
            </Paper>
          </main>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
