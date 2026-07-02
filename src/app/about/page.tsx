'use client'
import {
  Code2,
  FileArchive,
  FileText,
  Link2,
  Lock,
  Trash2,
  UserPlus,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { FeatureCard } from 'shared/components/feature-card'
import { CoffeeLink, DonateLink } from '@/shared/components/donate-link'
import { appConfig } from '@/shared/config'

const Signature = () => (
  <Image
    src="/signature.png"
    alt="Vercel"
    width={100}
    height={50}
    quality={100}
    sizes="100vw"
    className="mx-auto mt-6 dark:invert"
  />
)

export default function About() {
  return (
    <section className="fade-up-transition mx-auto max-w-md">
      {/* <div className="mx-auto size-fit rounded-full bg-primary/20 p-3 ring-2 ring-primary/50 ring-offset-2 ring-offset-background">
          <Logo className="mx-auto size-12 text-primary" />
        </div> */}
      <h1 className="mb-4 font-bold text-lg">درباره اپلیکیشن توشه</h1>
      <div className="space-y-2 text-sm/7">
        <p>
          توشه یک راهکار تحت وب مدرن و سریع برای جابه‌جایی متن و فایل بین
          دستگاه‌های مختلف است. این پروژه با تمرکز بر سادگی و امنیت، به کاربران
          اجازه می‌دهد اطلاعات خود را به صورت موقت در فضای ابری ذخیره کرده و تنها
          با یک کد رهگیری ۶ رقمی در دستگاهی دیگر بازیابی کنند.
        </p>
        <div className="space-y-2 font-medium">
          <p>
            ورژن: {appConfig.version} <br />
            <a target="_blank" href="https://soheilghanbary.ir" rel="noopener">
              توسعه دهنده: سهیل قنبری
            </a>{' '}
            <br />
            {/* آخرین بروزرسانی: {format(new Date(), 'd MMMM yyyy')} */}
          </p>
          <Signature />
          <DonateLink />
          <CoffeeLink />
        </div>
      </div>
      <div className="grid gap-4 py-12 sm:grid-cols-2">
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
