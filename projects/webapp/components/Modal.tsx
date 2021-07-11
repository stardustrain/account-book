import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { keyframes, styled } from '../styles/stitches.config'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  visible: boolean
  title?: string
  onClose?(): void
}

const animation = keyframes({
  '0%': {
    transform: 'translateY(0)',
    opacity: 0,
  },
  '100%': {
    transform: 'translateY(0)',
    opacity: 0.4,
  },
})

const Container = styled('div', {
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: '0',
  left: '0',
  backgroundColor: '$black20',
  opacity: '0.4',
  animation: `${animation} 300ms`,
})

const Wrapper = styled('div', {
  display: 'block',
  position: 'fixed',
  top: '50%',
  left: '50%',
  backgroundColor: 'white',
  transform: 'translate(-50%, -50%)',
  padding: '24px',
  borderRadius: '4px',
})

const Header = styled('header', {
  marginBottom: '16px',
})

const Modal = ({ children, visible, title, onClose }: Props) => {
  const [open, setOpen] = useState<boolean>(visible)

  const modalRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rootContainer = document.createElement('div')
      const parentElem = document.querySelector('#__next')
      parentElem?.insertAdjacentElement('afterend', rootContainer)
      modalRef.current = rootContainer
    }
  }, [modalRef])

  useEffect(() => {
    setOpen(visible)
  }, [visible])

  return modalRef.current
    ? ReactDOM.createPortal(
        open ? (
          <Container onClick={onClose}>
            <Wrapper onClick={(e) => e.stopPropagation()}>
              {title ? <Header>{title}</Header> : null}
              <div>{children}</div>
            </Wrapper>
          </Container>
        ) : null,
        modalRef.current,
      )
    : null
}

export default Modal
