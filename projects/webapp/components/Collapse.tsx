import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import type { AnimationProps } from 'framer-motion'

interface Props {
  className?: string
  in: boolean
  startingHegiht?: number | string
  endingHeight?: number | string
  children?: React.ReactNode
}

/**
 * NOTE:
 * custom => params of variant
 *
 * animate => key of variant
 */
const variants: AnimationProps['variants'] = {
  open: ({ endingHeight }) => ({
    height: endingHeight,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  exit: ({ startingHegiht }) => ({
    height: startingHegiht,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
}

const Collapse = forwardRef<HTMLDivElement, Props>(
  ({ className, in: isOpen, startingHegiht = 0, endingHeight = 'auto', ...rest }, ref) => {
    return (
      <AnimatePresence initial={false}>
        <motion.div
          ref={ref}
          className={className}
          animate={isOpen ? 'open' : 'exit'}
          variants={variants}
          custom={{
            startingHegiht,
            endingHeight,
          }}
          style={{ overflow: 'hidden' }}
          {...rest}
        />
      </AnimatePresence>
    )
  },
)

Collapse.displayName = 'Collapse'

export default Collapse
