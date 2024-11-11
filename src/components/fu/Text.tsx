import { Children, FC, forwardRef, ReactNode, Fragment } from 'react';
import Base from './Base';

const Text = forwardRef<any, {
  children: ReactNode
}>(({
  children,
  ...reset
}, ref) => {
  return <span {...reset} ref={ref} style={{fontSize: '18px'}}>
    <span contentEditable={false} style={{fontSize: 0}}>&nbsp;</span>
    { children }
  </span>
})

export default Text
