'use client'
import { CopyIcon, ShareIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from 'shared/components/ui/button'
import { TextField } from 'shared/components/ui/text-field'
import { toast } from 'sonner'

export const SuccessModal = ({ code }: { code: string }) => {
  const shareLink = `https://toosheh.vercel.app/?code=${code}`

  const handleShare = async () => {
    await navigator.share({
      title: `کلیپ بورد ${code}`,
      url: shareLink,
    })
  }

  return (
    <div className="flex flex-col gap-y-6 p-6 pb-0">
      <div className="rounded-lg border-2 border-teal-500 border-dashed bg-teal-500/10 p-3 text-center">
        <p className="font-semibold text-sm/5 text-teal-600 dark:text-teal-400">
          کلیپ بورد شما با موفقیت ایجاد شد 🎉 <br />
          کد رهگیری: <span className="font-bold text-lg">{code}</span>
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
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(code)
            toast('کد کپی شد')
          }}
        >
          <CopyIcon className="text-primary" />
          کپی کد
        </Button>
        <Button onClick={handleShare} variant="outline">
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
    </div>
  )
}
