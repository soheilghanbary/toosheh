import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from 'shared/components/ui/button'
import { Cards } from '@/shared/assets/svgs/cards'
import { CodeFile } from '@/shared/assets/svgs/code-file'
import { ZipFile } from '@/shared/assets/svgs/zip-file'
import { FeatureCard } from '@/shared/components/feature-card'

export default () => {
  return (
    <section>
      <div className="grid place-items-center gap-4 py-12">
        <h1 className="text-center font-black text-4xl">
          اشتراک گذاری کلیپ برد شما
        </h1>
        <p className="text-sm">بدون نیاز به ثبت نام</p>
        <Button asChild className="rounded-full">
          <Link href={'/create'}>
            <PlusIcon />
            ایجاد کلیپ برد
          </Link>
        </Button>
      </div>
      <div className="grid gap-8 py-12 lg:grid-cols-3">
        <FeatureCard
          title="همگام سازی متنی"
          description="فضای ایمن برای همگام سازی متون ، پسوردها ، ایمیل و سایر داده های
            متنی در سایر دستگاه ها"
          svg={<Cards />}
        />
        <FeatureCard
          title="همگام سازی اسناد و فایل‌ها"
          description="فضای ایمن برای همگام سازی ایمن فایل‌ها و اسناد در سایر دستگاه ها"
          svg={<ZipFile />}
        />
        <FeatureCard
          title="همگام سازی کدها"
          description="فضای ایمن برای اشتراک و ویرایش کد در سایر دستگاه ها"
          isComingSoon
          svg={<CodeFile />}
        />
      </div>
    </section>
  )
}
