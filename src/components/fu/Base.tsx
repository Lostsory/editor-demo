import { createElement, FC, HTMLAttributes, ReactNode, useRef } from "react";

interface BaseProps extends HTMLAttributes<HTMLElement> {
  tagName?: string,
  children: ReactNode,
}

const Base: FC<BaseProps> = (props) => {
  const elemRef = useRef<HTMLDivElement>(null);
  const {tagName = 'div', children, style, onMouseOver, onMouseOut, ...reset} = props

  const handleMouseOver = (e: any) => {
    console.log('1111', elemRef.current);
    if (elemRef.current) {
      elemRef.current.style.borderColor = 'red'
    }
    e.stopPropagation(); 
    onMouseOver?.(e)
  }
  const handleMouseOut = (e: any) => {
    if (elemRef.current) {
      elemRef.current.style.borderColor = 'transparent'
    }
    e.stopPropagation(); 
    onMouseOut?.(e)
  }
  return createElement(
    tagName || 'div',
    {
      ref: elemRef,
      style: {...style, border: '1px solid transparent'},
      ...reset,
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      'data-base': 'base'
    },
    children);
}

export default Base