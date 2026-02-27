import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { AppHeader } from '@/shared/components/app-header'
import { TrackForm } from '@/shared/components/track-form'

export default () => {
  return (
    <Fragment>
      <AppHeader title="رهگیری کلیپ برد" />
      <main className="mt-2 flex flex-col gap-y-2">
        <Suspense fallback={<Loader2 className="mx-auto my-32 size-6" />}>
          <TrackForm />
        </Suspense>
      </main>
    </Fragment>
  )
}
