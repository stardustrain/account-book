import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import FocusTrap from 'focus-trap-react'
import { keyframes, styled } from '../styles/stitches.config'

import type { ReactNode } from 'react'

import Close from '../icons/Close'

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

const Wrapper = styled('section', {
  display: 'block',
  position: 'fixed',
  top: '50%',
  left: '50%',
  backgroundColor: 'white',
  transform: 'translate(-50%, -50%)',
  padding: '$spacing3',
  borderRadius: '4px',
  minWidth: '400px',
})

const Header = styled('header', {
  marginBottom: '$spacing2',
})

const CloseButton = styled('button', {
  position: 'absolute',
  right: '$spacing3',
  top: '$spacing3',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  padding: '4px',
})

const Content = styled('div', {})

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
          <FocusTrap>
            <Container onClick={onClose}>
              <Wrapper onClick={(e) => e.stopPropagation()}>
                {title ? <Header>{title}</Header> : null}
                <CloseButton onClick={onClose}>
                  <Close size={12} />
                </CloseButton>
                <Content>{children}</Content>
              </Wrapper>
            </Container>
          </FocusTrap>
        ) : null,
        modalRef.current,
      )
    : null
}

export default Modal
