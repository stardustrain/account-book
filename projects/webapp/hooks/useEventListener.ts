import { useEffect } from 'react'
import type { RefObject } from 'react'

interface OptionProps {
  capture?: boolean
  once?: boolean
  passive?: boolean
}

interface Props {
  element: RefObject<HTMLElement>
  type: string
  options?: OptionProps
  handler: (e: Event) => void
}

export const useEventListener = ({ element, type, options, handler }: Props) => {
  useEffect(() => {
    if (!element.current) return

    element.current.addEventListener(type, handler, options)

    return () => {
      element.current.removeEventListener(type, handler, options)
    }
  }, [element, type])
}
