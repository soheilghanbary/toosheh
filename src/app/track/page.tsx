import { Suspense } from 'react'
import Loading from '@/app/loading'
import { TrackForm } from '@/shared/components/track-form'

export default () => {
  return (
    <Suspense fallback={<Loading />}>
      <TrackForm />
    </Suspense>
  )
}
