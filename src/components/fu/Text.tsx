import { Children, FC, forwardRef, ReactNode, Fragment } from 'react';
import Base from './Base';

// const Text = forwardRef<any, {
//   children: ReactNode
// }>(({
//   children,
//   ...reset
// }, ref) => {
//   return <Base {...reset} style={{display: 'inline-block', paddingLeft: '.1px'}} ref={ref} tagName='p'>

//     { children }
//   </Base>
// })

const Text = forwardRef<any, {
  children: ReactNode
}>(({
  children,
  ...reset
}, ref) => {
  return <Fragment  ref={ref} tagName='p'>

    { children }
  </Fragment>
})

export default Text
