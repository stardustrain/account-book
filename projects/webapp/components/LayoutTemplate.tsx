import { ReactNode } from 'react'
import { styled } from '../styles/stitches.config'

interface Props {
  children: ReactNode
}

const Aside = styled('aside', {
  position: 'fixed',
  backgroundColor: '$blue80',
  width: '240px',
  height: '100%',
})

const Main = styled('main', {
  marginLeft: '240px',
  padding: '$spacing3',
})

const LayoutTemplate = ({ children }: Props) => {
  return (
    <>
      <Aside />
      <Main>{children}</Main>
    </>
  )
}

export default LayoutTemplate
