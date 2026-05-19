import { Fragment } from 'react/jsx-runtime'
import { ClipboardForm } from 'shared/components/clipboard-form'
import { AppHeader } from '@/shared/components/app-header'

export default () => {
  return (
    <Fragment>
      <AppHeader title="ایجاد کلیپ برد" />
      <main className="mt-2 flex flex-col gap-y-2">
        <ClipboardForm />
      </main>
    </Fragment>
  )
}
