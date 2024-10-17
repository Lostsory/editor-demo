import { Children, FC, ReactNode } from 'react';
import Base from './Base';

const Text: FC<{
  children: ReactNode,
}> = ({
  children,
  ...reset
}) => {
  return <Base {...reset} tagName='p'>
    { children }
  </Base>
}

export default Text
