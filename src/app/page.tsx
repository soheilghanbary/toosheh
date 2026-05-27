import {
  Code2,
  FileArchive,
  FileText,
  Link2,
  Lock,
  PlusIcon,
  Trash2,
  UserPlus,
  Zap,
} from 'lucide-react'

import Link from 'next/link'
import { SearchIcon } from 'shared/assets/icons'
import { Button } from 'shared/components/ui/button'
import { FeatureCard } from '@/shared/components/feature-card'

export default function Page() {
  return (
    <section>
      <div className="grid place-items-center gap-4 py-12">
        <h1 className="text-center font-black text-2xl md:text-4xl">
          اشتراک گذاری کلیپ بورد شما
        </h1>
        <div className="flex items-center justify-center gap-4">
          <Button asChild className="rounded-full">
            <Link href="/create">
              <PlusIcon />
              ایجاد کلیپ بورد
            </Link>
          </Button>
          <Button variant={'secondary'} asChild className="rounded-full">
            <Link href="/track">
              <SearchIcon />
              رهگیری
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
        <FeatureCard
          title="بدون نیاز به ثبت نام"
          description="بدون ساخت اکانت و در کمترین زمان، کلیپ بورد خود را ایجاد و استفاده کنید"
          svg={<UserPlus />}
        />

        <FeatureCard
          title="رمزنگاری شده"
          description="تمام داده‌های شما به صورت امن رمزنگاری شده و از دسترسی غیرمجاز محافظت می‌شوند"
          svg={<Lock />}
        />

        <FeatureCard
          title="همگام سازی متنی"
          description="فضای ایمن برای همگام سازی متون، پسوردها، ایمیل و سایر داده‌های متنی"
          svg={<FileText />}
        />

        <FeatureCard
          title="همگام سازی فایل‌ها"
          description="اشتراک گذاری و ذخیره امن فایل‌ها و اسناد بین دستگاه‌های مختلف"
          svg={<FileArchive />}
        />

        <FeatureCard
          title="همگام سازی کدها"
          description="اشتراک و ویرایش کد با سینتکس مناسب برای برنامه‌نویسان"
          isComingSoon
          svg={<Code2 />}
        />

        <FeatureCard
          title="دسترسی سریع"
          description="دسترسی سریع به کلیپ بورد از هر دستگاه و هر مکان"
          svg={<Zap />}
        />

        <FeatureCard
          title="حذف خودکار"
          description="امکان تعیین زمان برای حذف خودکار داده‌ها جهت افزایش امنیت"
          svg={<Trash2 />}
        />

        <FeatureCard
          title="لینک اشتراک گذاری"
          description="ساخت لینک اختصاصی برای اشتراک گذاری سریع با دیگران"
          svg={<Link2 />}
        />
      </div>
    </section>
  )
}
