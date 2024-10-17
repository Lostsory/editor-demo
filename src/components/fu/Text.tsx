import { Children, FC, forwardRef, ReactNode } from 'react';
import Base from './Base';

const Text = forwardRef<HTMLParagraphElement, {
  children: ReactNode
}>(({
  children,
  ...reset
}, ref) => {
  return <Base {...reset} ref={ref} tagName='p'>
    { children }
  </Base>
})

export default Text
