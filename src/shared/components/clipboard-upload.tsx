import { EyeIcon, Loader2, UploadIcon, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Label } from 'shared/components/ui/label'
import { cn } from 'shared/lib/utils'
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
      alert(`خطا در آپلود: ${e.message}`)
    },
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsUploading(true)
      startUpload(acceptedFiles)
    },
    [startUpload]
  )

  const removeFile = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 3,
  })

  return (
    <div className="grid gap-2">
      <Label>فایل‌های پیوست</Label>
      {value.map((url, index) => (
        <div
          key={url}
          className="flex items-center justify-between gap-x-4 rounded-md border p-3"
        >
          <span className="grow truncate text-sm">فایل {index + 1}</span>
          <a href={url} target="_blank" rel="noreferrer">
            <EyeIcon className="size-4 text-primary" />
          </a>
          <button
            type="button"
            onClick={() => removeFile(url)}
            className="text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <div
        {...getRootProps()}
        className={cn(
          'flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md border-[1.5px] border-primary border-dashed bg-primary/5 text-primary active:scale-95',
          isDragActive && 'bg-primary/10'
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <UploadIcon className="size-5" />
        )}
        <p className="font-medium text-sm">
          {isUploading ? 'در حال آپلود...' : 'آپلود فایل جدید'}
        </p>
      </div>
    </div>
  )
}
