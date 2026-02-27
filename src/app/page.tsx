import Link from 'next/link'
import { BoltIcon, SearchIcon } from '@/shared/assets/icons'
import { Cards } from '@/shared/assets/svgs/cards'
import { CodeFile } from '@/shared/assets/svgs/code-file'
import { ZipFile } from '@/shared/assets/svgs/zip-file'
import { FeatureCard } from '@/shared/components/feature-card'
import { ModeToggle } from '@/shared/components/mode-toggle'
import { Button } from '@/shared/components/ui/button'

export default () => {
  return (
    <section className="p-4 pb-20">
      <header className="-m-4 flex max-h-28 flex-col gap-3 rounded-b-2xl bg-primary p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-sm text-white">
            توشه (اشتراک گذاری کلیپ برد شما)
          </p>
          <ModeToggle />
        </div>
        <div className="flex flex-col rounded-2xl border bg-card p-4 shadow-card">
          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant={'default'}>
              <Link href={'/new'}>
                <BoltIcon />
                ایجاد کلیپ برد
              </Link>
            </Button>
            <Button asChild variant={'outline'}>
              <Link href={'/track'}>
                <SearchIcon />
                رهگیری کد
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <section className="mt-16">
        <div className="flex flex-col gap-y-3 rounded-2xl border bg-card p-4 shadow-card">
          <h2 className="font-semibold text-base/5">ایجاد ارتباط جدید</h2>
          <FeatureCard
            link="/"
            title="همگام سازی متنی"
            description="فضای ایمن برای همگام سازی متون ، پسوردها ، ایمیل و سایر داده های
            متنی در سایر دستگاه ها"
            svg={<Cards />}
          />
          <FeatureCard
            link="/"
            title="همگام سازی اسناد و فایل‌ها"
            description="فضای ایمن برای همگام سازی ایمن فایل‌ها و اسناد در سایر دستگاه ها"
            svg={<ZipFile />}
            isComingSoon
          />
          <FeatureCard
            link="/"
            title="همگام سازی کدها"
            description="فضای ایمن برای اشتراک و ویرایش کد در سایر دستگاه ها"
            isComingSoon
            svg={<CodeFile />}
          />
        </div>
      </section>
    </section>
  )
}
