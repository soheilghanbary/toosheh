import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { SearchIcon } from 'shared/assets/icons'
import { Button } from 'shared/components/ui/button'

export default function Page() {
  return (
    <section>
      <div className="grid place-items-center gap-4 py-12">
        <h1 className="text-center font-black text-2xl md:text-3xl">
          اشتراک گذاری کلیپ بورد شما
        </h1>
        <p className="text-muted-foreground text-sm">
          ارسال فوری متن، تصاویر یا فایل‌ها به هر دستگاهی
        </p>
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
    </section>
  )
}
