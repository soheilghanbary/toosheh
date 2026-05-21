'use client'
import { CopyIcon, ShareIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { Suspense } from 'react'
import { Button } from 'shared/components/ui/button'
import { TextField } from 'shared/components/ui/text-field'
import { toast } from 'sonner'

const SuccessPage = () => {
  const params = useSearchParams()
  const code = params.get('code') as string
  const shareLink = `https://toosheh.vercel.app/track?code=${code}`

  const handleShare = async () => {
    await navigator.share({
      title: `کلیپ برد ${code}`,
      url: `https://toosheh.vercel.app/track?code=${code}`,
    })
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-y-6 rounded-xl bg-muted/40 p-6">
      {params.get('code')}
      <div className="rounded-lg border-2 border-teal-500 border-dashed bg-teal-500/10 p-3 text-center">
        <p className="font-semibold text-sm/5 text-teal-600 dark:text-teal-400">
          کلیپ برد شما با موفقیت ایجاد شد 🎉 <br />
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
          className="text-muted-foreground"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(code)
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
    </div>
  )
}

export default () => {
  return (
    <Suspense>
      <SuccessPage />
    </Suspense>
  )
}
