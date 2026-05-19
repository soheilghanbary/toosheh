import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  fileUploader: f({
    blob: { maxFileSize: '4MB', maxFileCount: 3 },
    image: { maxFileSize: '4MB', maxFileCount: 3 },
  }).onUploadComplete(async ({ file }) => {
    console.log('فایل آپلود شد:', file.url)
    return { url: file.url }
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
