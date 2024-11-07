import { forwardRef } from 'react';

const View = forwardRef<any, {
  src: string,
  isSelect: boolean
}>((props, ref) => {
  const {isSelect, src, ...reset} = props
  return <img
    ref={ref}
    src={src}
    {...reset}
    style={{
      border: isSelect ? '1px solid red' : '1px solid transparent',
      width: '200px',
      height: 'auto',
      display: 'inline-block'
    }}
    alt=""
  />
})

export default View

