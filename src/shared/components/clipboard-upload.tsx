import { EyeIcon, UploadIcon, X } from 'lucide-react'
import { Activity, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Separator } from 'shared/components/ui/separator'
import { cn } from 'shared/lib/utils'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useUploadThing } from '@/lib/uploadthing'

export const ClipboardUpload = ({
  value = [],
  onChange,
}: {
  value: string[]
  onChange: (urls: string[]) => void
}) => {
  const [isUploading, setIsUploading] = useState(false)

  const { startUpload } = useUploadThing('fileUploader', {
    onClientUploadComplete: (res) => {
      setIsUploading(false)
      const newUrls = res.map((file) => file.ufsUrl)
      onChange([...value, ...newUrls])
    },
    onUploadError: (e) => {
      setIsUploading(false)
      toast.error(`خطا در آپلود: ${e.message}`)
    },
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsUploading(true)
      startUpload(acceptedFiles)
    },
    [startUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 3 - value.length,
    disabled: isUploading || value.length >= 3,
  })

  return (
    <div className="grid gap-2">
      <button
        type="button"
        disabled={isUploading || value.length >= 3}
        className={cn(
          'flex h-10 cursor-pointer items-center justify-center gap-2 rounded-4xl border border-primary border-dashed bg-primary/5 text-primary transition-all hover:bg-primary/10 active:scale-95',
          isDragActive && 'bg-primary/10'
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadIcon className="size-4.5" />
        <p className="font-medium text-sm">بارگذاری</p>
      </button>
      <Separator className="my-2" />
      {isUploading &&
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="mb-1 flex items-center gap-2 p-1 last:mb-0"
          >
            <Skeleton className="size-12 rounded-md" />
            <div className="flex grow flex-col gap-1">
              <Skeleton className="h-5 w-2/3 rounded-md" />
              <Skeleton className="h-5 w-1/3 rounded-md" />
            </div>
          </div>
        ))}
      <Activity mode={!isUploading ? 'visible' : 'hidden'}>
        {value.map((url, index) => (
          <div
            key={url}
            className="flex items-center justify-between gap-x-4 rounded-md bg-muted p-2"
          >
            <span className="grow truncate pr-1 font-medium text-sm">
              فایل {index + 1}
            </span>
            <div className="flex items-center space-x-1">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full p-1.5"
              >
                <EyeIcon className="size-4 text-muted-foreground transition-colors hover:text-foreground" />
              </a>
              <button
                type="button"
                onClick={() => onChange(value.filter((u) => u !== url))}
                className="rounded-full p-1.5"
              >
                <X className="size-4 text-muted-foreground transition-colors hover:text-foreground" />
              </button>
            </div>
          </div>
        ))}
      </Activity>
    </div>
  )
}
