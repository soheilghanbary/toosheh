import { Fragment } from 'react/jsx-runtime'
import { AppHeader } from '@/shared/components/app-header'
import { TrackForm } from '@/shared/components/track-form'

export default () => {
  return (
    <Fragment>
      <AppHeader title="رهگیری کلیپ برد" />
      <main className="mt-2 flex flex-col gap-y-2">
        <TrackForm />
      </main>
    </Fragment>
  )
}
