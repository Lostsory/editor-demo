import { Children, FC, forwardRef, ReactNode } from 'react';
import Base from './Base';

const View = forwardRef<any, {
  children: ReactNode,
  isSelect: boolean
}>(({
  children,
  ...reset
}, ref) => {
  const {isSelect} = reset
  return <Base {...reset} ref={ref} style={{border: isSelect ? '1px solid red' : '1px solid transparent'}}>
    { children }
  </Base>
})

export default View

