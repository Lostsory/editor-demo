import { Children, FC, forwardRef, ReactNode, Fragment } from 'react';
import Base from './Base';

const Text = forwardRef<any, {
  children: ReactNode
}>(({
  children,
  ...reset
}, ref) => {
  return <Base {...reset} ref={ref} tagName='span'>
    <span contentEditable={false} style={{fontSize: 0}}>&nbsp;</span>
    { children }
  </Base>
})

export default Text
