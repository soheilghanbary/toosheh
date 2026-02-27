'use client'
import Image from 'next/image'
import { Fragment } from 'react'
import { AppHeader } from '@/shared/components/app-header'
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
    <Fragment>
      <AppHeader title="درباره ما" />
      <section className="fade-up-transition p-4">
        {/* <div className="mx-auto size-fit rounded-full bg-primary/20 p-3 ring-2 ring-primary/50 ring-offset-2 ring-offset-background">
          <Logo className="mx-auto size-12 text-primary" />
        </div> */}
        <div className="space-y-2 text-xs/6">
          <p className="text-center">
            توشه یک راهکار تحت وب مدرن و سریع برای جابه‌جایی متن و فایل بین
            دستگاه‌های مختلف است. این پروژه با تمرکز بر سادگی و امنیت، به کاربران
            اجازه می‌دهد اطلاعات خود را به صورت موقت در فضای ابری ذخیره کرده و
            تنها با یک کد رهگیری ۶ رقمی در دستگاهی دیگر بازیابی کنند.
          </p>
          <div className="space-y-2 text-center font-medium">
            <p>
              ورژن: {appConfig.version} <br />
              <a
                target="_blank"
                href="https://soheilghanbary.ir"
                rel="noopener"
              >
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
      </section>
    </Fragment>
  )
}
