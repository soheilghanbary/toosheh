import { Fragment } from 'react/jsx-runtime'
import { AppHeader } from '@/shared/components/app-header'
import { ClipForm } from '@/shared/components/forms/clip-form'
import { Paper } from '@/shared/components/ui/paper'

export default () => {
  return (
    <Fragment>
      <AppHeader title="ایجاد کلیپ برد" />
      <main className="mt-2 flex flex-col gap-y-2">
        <Paper>
          <p className="text-center text-muted-foreground text-xs/4.5">
            فضای ایمن برای همگام سازی متون ، پسوردها ، ایمیل و سایر داده های
            متنی در سایر دستگاه ها
          </p>
        </Paper>
        <ClipForm />
      </main>
    </Fragment>
  )
}
