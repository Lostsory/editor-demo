import React, { createElement, forwardRef, Fragment, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import View from '@/components/fu/View';
import Text from '@/components/fu/Text';

interface ElementNode{
  type: 'Text' | 'View',
  text?: string,
  [x: string]: any,
  children?: Array<ElementNode>
}

function Home() {
  const [schema, setSchema] = useState<Array<ElementNode>>([
    {
      type: 'Text',
      text: 'text1'
    },
    {
      type: 'View',
      children: [
        {
          type: 'Text',
          text: 'text2'
        },
        {
          type: 'Text',
          text: 'text3'
        },
      ]
    },
  ])
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {

    // 检测删除键的按下
    if (event.key === 'Backspace' || event.key === 'Delete') {

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const currentNode = range.startContainer;
        let containerNode = currentNode.parentNode
        if (containerNode?.nodeType !== Node.TEXT_NODE) {
          if (containerNode instanceof HTMLElement) {
            const dataAttributes = containerNode.dataset;
            if (dataAttributes.base === 'caret') {
              event.preventDefault()
              containerNode = containerNode.previousSibling
              console.log('containerNode', containerNode);
            }
          }
        }
      }
    }
    if (event.key === 'Enter') {
      // event.preventDefault();  // 防止在 contentEditable 中默认的换行操作
    }
  };
  const handleInput = () => {

  };
  const change = () => {
    console.log('change');
  }
  const renderContent = (list: Array<ElementNode>): ReactNode => {
    // const children: ReactNode = []
    // return createElement(
    //   Fragment,
    //   null,
    //   schema.map((v) => {
    //     if (v.type === 'Text') {
    //       return <Text>{}</Text>
    //     }
    //   })
    // )

    return <>
      {list.map((v, i) => {
        if (v.type === 'Text') {
          return <Fragment key={i}>
            <Text>{v.text}</Text>
          </Fragment>
        }
        if (v.type === 'View') {
          return <Fragment key={i}>
            <View>{v.children && renderContent(v.children)}</View>
          </Fragment>
        }
        return null
      })}
    </>
  }
  return <div className='p-[100px] bg-[#f5f6f7]'>
    <div>
      我是&#8203;标题
    </div>
    <div
      className='bg-white p-5 min-h-[100vh] outline-none rounded-none'
      contentEditable
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      ref={containerRef}
    >
      {renderContent(schema)}
      <div
        style={{minWidth: '1px', display: 'inline-block'}}
        onClick={(e) => {
          console.log('222', e);
        }}
        data-base="caret"
      >&#8203;</div>
    </div>
  </div>
}

export default Home;
