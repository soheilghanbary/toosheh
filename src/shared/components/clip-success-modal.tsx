'use client'
import { AnimatePresence, motion } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { useLayoutEffect } from 'react'
import { toast } from 'sonner'
import { CopyIcon, ShareIcon } from '@/shared/assets/icons'
import { AppHeader } from '@/shared/components/app-header'
import { Button } from '@/shared/components/ui/button'
import { Paper } from '@/shared/components/ui/paper'
import { TextField } from '@/shared/components/ui/text-field'

interface Props {
  isOpen: boolean
  data: { code: string; id: string } | null
  onClose: () => void
}

const MODAL_VARIANTS = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  header: {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0 },
  },
}

export const ClipSuccessModal = ({ isOpen, data, onClose }: Props) => {
  useLayoutEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])

  const shareLink = data
    ? `${process.env.NEXT_PUBLIC_URL}/track?code=${data.code}`
    : ''

  const handleShare = async () => {
    if (!data) return
    const shareData = {
      title: `کلیپ برد ${data.code} در توشه`,
      text: `محتوای کلیپ‌برد "${data?.code}" را از طریق لینک زیر مشاهده کنید.`,
      url: shareLink,
    }
    await navigator.share(shareData)
  }

  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.section
          variants={MODAL_VARIANTS.overlay}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-999 mx-auto flex size-full max-w-md flex-col bg-background"
        >
          <AppHeader title="کلیپ برد شما" hideBackButton />
          <main className="mt-2 flex flex-col gap-y-2 pb-6">
            <Paper>
              <div className="rounded-lg border-2 border-success border-dashed bg-success/10 p-3 text-center">
                <p className="font-semibold text-sm/5 text-success">
                  کلیپ برد شما با موفقیت ایجاد شد 🎉 <br />
                  کد رهگیری:{' '}
                  <span className="font-bold text-lg">{data.code}</span>
                </p>
              </div>
              <TextField
                readOnly
                label="لینک ایجاد شده"
                value={shareLink}
                inputClass="ltr text-muted-foreground text-xs"
              />
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="text-muted-foreground"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(data.code)
                    toast('لینک کپی شد')
                  }}
                >
                  <CopyIcon className="text-primary" />
                  کپی کد
                </Button>
                <Button
                  onClick={handleShare}
                  className="text-muted-foreground"
                  variant="outline"
                >
                  <ShareIcon className="text-primary" />
                  اشتراک گذاری
                </Button>
              </div>
              <QRCodeSVG
                size={160}
                value={shareLink}
                bgColor="var(--card)"
                fgColor="var(--foreground)"
                className="mx-auto"
              />
              <p className="text-center text-muted-foreground text-tiny">
                کد QR ایجاد شده را اسکن کنید
              </p>
            </Paper>
            <Paper>
              <Button className="w-full" onClick={onClose}>
                ایجاد کلیپ برد جدید
              </Button>
            </Paper>
          </main>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
