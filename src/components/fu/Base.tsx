import { createElement, FC, forwardRef, HTMLAttributes, ReactNode, useRef } from "react";

interface BaseProps extends HTMLAttributes<HTMLElement> {
  tagName?: string,
  children: ReactNode,
}

// const InlineChromiumBugfix = () => (
//   <span
//     contentEditable={false}
//     style={{'fontSize': 0}}
//   >
//     {String.fromCodePoint(160) /* Non-breaking space */}
//   </span>
// )

const Base = forwardRef<HTMLElement, BaseProps>((props, ref) => {
  const {tagName = 'div', children, style, onMouseOver, onMouseOut, ...reset} = props

  const handleMouseOver = (e: any) => {
    // console.log('1111', elemRef.current);
    // if (elemRef.current) {
    //   elemRef.current.style.borderColor = 'red'
    // }
    e.stopPropagation();
    onMouseOver?.(e)
  }
  const handleMouseOut = (e: any) => {
    // if (elemRef.current) {
    //   elemRef.current.style.borderColor = 'transparent'
    // }
    e.stopPropagation();
    onMouseOut?.(e)
  }
  return createElement(
    tagName || 'div',
    {
      ref,
      style: {...style},
      ...reset,
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      'data-base': 'base'
    },
    // String.fromCodePoint(160),
    children,
    // createElement(InlineChromiumBugfix),
  );
})

export default Base
