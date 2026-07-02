'use client'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { ClipboardForm } from 'shared/components/clipboard-form'
import { TrackForm } from 'shared/components/track-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Page() {
  return (
    <section>
      <div className="grid place-items-center gap-4">
        <h1 className="text-center font-black text-2xl md:text-3xl">
          کلیپ برد آنلاین
        </h1>
        <p className="text-muted-foreground text-sm">
          ارسال فوری متن، تصاویر یا فایل‌ها به هر دستگاهی
        </p>
        <div className="container-sm w-full">
          <Tabs defaultValue="send">
            <TabsList className="mb-2 w-full">
              <TabsTrigger value="send">
                <ArrowUp />
                ارسال
              </TabsTrigger>
              <TabsTrigger value="receive">
                <ArrowDown />
                دریافت
              </TabsTrigger>
            </TabsList>
            <TabsContent value="send">
              <ClipboardForm />
            </TabsContent>
            <TabsContent value="receive">
              <TrackForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
