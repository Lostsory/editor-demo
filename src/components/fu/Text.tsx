import { Children, FC, forwardRef, ReactNode, Fragment } from 'react';
import Base from './Base';

const Text = forwardRef<any, {
  children: ReactNode
}>(({
  children,
  ...reset
}, ref) => {
  return <Base {...reset} style={{display: 'inline-block', paddingLeft: '.1px'}} ref={ref} tagName='p'>
    <span contentEditable={false} style={{fontSize: 0}}>&nbsp;</span>
    { children }
  </Base>
})

export default Text
