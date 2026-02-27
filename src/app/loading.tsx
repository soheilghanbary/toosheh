import { Spinner } from '@/shared/components/ui/spinner'

export default function Loading() {
  return (
    <div className="p-4">
      <Spinner className="mx-auto my-32 size-6 text-primary" />
    </div>
  )
}
