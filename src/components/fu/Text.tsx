import { Children, FC, ReactNode } from 'react';
import Base from './Base';

const Text: FC<{
  children: ReactNode
}> = ({
  children
}) => {
  return <Base tagName='p'>
    { children }
  </Base>
}

export default Text