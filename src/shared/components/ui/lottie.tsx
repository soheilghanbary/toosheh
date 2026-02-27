'use client'
// import type { LottieComponentProps } from 'lottie-react'
// import LottieComponent from 'lottie-react'

// export const Lottie = (props: LottieComponentProps) => {
//   return <LottieComponent {...props} />
// }
import {
  DotLottieReact,
  type DotLottieReactProps,
} from '@lottiefiles/dotlottie-react'

export function Lottie(props: DotLottieReactProps) {
  return <DotLottieReact {...props} />
}
