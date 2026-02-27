import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

type CreateClipInput = {
  type: 'text' | 'file' | 'code'
  title: string
  content: string
  expiration: string
  hasPassword?: boolean
  password?: string
  isOneTime?: boolean
}

export const useCreateClip = () => {
  return useMutation({
    mutationFn: async (json: CreateClipInput) => {
      const response = await fetch('/api/clip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'خطایی رخ داده است')
      }
      return data as { success: boolean; id: string; code: string }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useTrackClip = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch(`/api/t/${code}`)
      if (!res.ok) throw new Error('کد نامعتبر یا منقضی شده است')
      return res.json()
    },
  })
}
