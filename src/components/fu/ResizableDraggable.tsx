import { FC } from 'react';

const ResizableDraggable: FC<{
  width: number,
  height: number,
  top: number,
  left: number,
}> = (props) => {
  return <div
    style={{
      width: `${props.width}px`,
      height: `${props.height}px`,
      top: `${props.top}px`,
      left: `${props.left}px`,
    }}
    className='absolute border border-solid border-[#336df4]'
  >

  </div>
}

export default ResizableDraggable
