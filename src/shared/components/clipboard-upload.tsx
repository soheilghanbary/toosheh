import { EyeIcon, Loader2, UploadIcon, X } from 'lucide-react'
import { Activity, useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileIcon } from 'shared/assets/icons'
import { buttonVariants } from 'shared/components/ui/button'
import { Separator } from 'shared/components/ui/separator'
import { cn } from 'shared/lib/utils'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useUploadThing } from '@/lib/uploadthing'

type UploadState = {
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
}

export const ClipboardUpload = ({
  value = [],
  onChange,
}: {
  value: string[]
  onChange: (urls: string[]) => void
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: 'idle',
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const stopFakeProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startFakeProgress = () => {
    setUploadState({ progress: 0, status: 'uploading' })

    intervalRef.current = setInterval(() => {
      setUploadState((prev) => {
        if (prev.progress >= 90) return prev
        return { ...prev, progress: prev.progress + Math.random() * 10 }
      })
    }, 300)
  }

  const { startUpload } = useUploadThing('fileUploader', {
    onClientUploadComplete: (res) => {
      stopFakeProgress()

      setUploadState({ progress: 100, status: 'success' })
      setIsUploading(false)

      const newUrls = res.map((file) => file.ufsUrl)
      onChange([...value, ...newUrls])

      toast.success('آپلود با موفقیت انجام شد')

      setTimeout(() => {
        setUploadState({ progress: 0, status: 'idle' })
      }, 800)
    },

    onUploadError: (e) => {
      stopFakeProgress()

      setUploadState({ progress: 0, status: 'error' })
      setIsUploading(false)

      toast.error(`خطا در آپلود: ${e.message}`)
    },
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsUploading(true)
      startFakeProgress()
      startUpload(acceptedFiles)
    },
    [startUpload]
  )

  const cancelUpload = () => {
    stopFakeProgress()
    setIsUploading(false)
    setUploadState({ progress: 0, status: 'idle' })
    toast.message('آپلود لغو شد')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 3 - value.length,
    disabled: isUploading || value.length >= 3,
  })

  return (
    <div className="grid gap-3">
      {/* Upload Button */}
      <button
        type="button"
        disabled={isUploading || value.length >= 3}
        className={cn(buttonVariants({ variant: 'outline' }), 'w-fit')}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadIcon className="size-4" />
        <p className="font-medium text-sm">آپلود فایل</p>
      </button>

      {/* Upload Panel */}
      {isUploading && (
        <div className="rounded-xl border bg-muted/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span className="font-medium text-sm">
                {uploadState.status === 'uploading' && 'در حال آپلود...'}
                {uploadState.status === 'success' && 'انجام شد'}
                {uploadState.status === 'error' && 'خطا در آپلود'}
              </span>
            </div>

            <button type="button" onClick={cancelUpload}>
              <X className="size-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full rounded-full bg-background">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>

          <p className="mt-1 text-muted-foreground text-xs">
            {Math.round(uploadState.progress)}%
          </p>
        </div>
      )}
      <Separator />
      {/* Skeleton */}
      {isUploading &&
        Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-1">
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      {/* Uploaded Items */}
      <Activity mode={!isUploading ? 'visible' : 'hidden'}>
        <div className="flex flex-col gap-2">
          {value.map((url, index) => (
            <div
              key={url}
              className="group flex items-center justify-between rounded-xl border border-muted bg-card p-3 transition-all hover:border-muted-foreground/20 hover:bg-muted/60"
            >
              {/* Left side */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileIcon className="size-4" />
                </div>

                <div className="flex flex-col">
                  <span className="truncate font-medium text-sm">
                    فایل {index + 1}
                  </span>

                  <span className="text-[10px] text-muted-foreground">
                    آماده مشاهده
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-70 transition group-hover:opacity-100">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener"
                  className="flex size-8 items-center justify-center rounded-lg transition hover:bg-background"
                >
                  <EyeIcon className="size-4 text-muted-foreground hover:text-foreground" />
                </a>

                <button
                  type="button"
                  onClick={() => onChange(value.filter((u) => u !== url))}
                  className="flex size-8 items-center justify-center rounded-lg transition hover:bg-destructive/10"
                >
                  <X className="size-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Activity>
    </div>
  )
}
