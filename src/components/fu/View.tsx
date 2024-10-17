import { Children, FC, forwardRef, ReactNode } from 'react';
import Base from './Base';

const View = forwardRef<HTMLParagraphElement, {
  children: ReactNode
}>(({
  children,
  ...reset
}, ref) => {
  return <Base {...reset} ref={ref} style={{width: '200px', border: '1px solid red',}}>
    { children }
  </Base>
})

export default View

