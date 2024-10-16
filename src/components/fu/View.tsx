import { Children, FC, ReactNode } from 'react';
import Base from './Base';

const View: FC<{
  children: ReactNode
}> = ({
  children
}) => {
  return <Base  style={{width: '200px', border: '1px solid red',}}>
    { children }
  </Base>
}

export default View
