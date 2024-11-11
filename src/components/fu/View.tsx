import { Children, FC, forwardRef, ReactNode } from 'react';
import Base from './Base';

const View = forwardRef<any, {
  children: ReactNode,
  isSelect: boolean
}>((props, ref) => {
  const {isSelect, children, ...reset} = props
  return <div {...reset} ref={ref} style={{border: isSelect ? '1px solid red' : '1px solid transparent', fontSize: 0}}>
    { children }
  </div>
})

export default View

