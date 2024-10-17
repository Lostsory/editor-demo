import React, { createElement, forwardRef, Fragment, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { fromJS } from 'immutable';

import View from '@/components/fu/View';
import Text from '@/components/fu/Text';

interface ElementNode{
  type: 'Text' | 'View',
  text?: string,
  [x: string]: any,
  children?: Array<ElementNode>
}

function Home() {
  const [isComposing, setIsComposing] = useState<boolean>(false)
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
  const renderContent = (list: Array<ElementNode>, p: Array<number> = []): ReactNode => {
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
        const path = [...p, i]
        if (v.type === 'Text') {
          return <Fragment key={i}>
            <Text data-fuID={path}>{v.text}</Text>
          </Fragment>
        }
        if (v.type === 'View') {
          return <Fragment key={i}>
            <View data-path={path}>{v.children && renderContent(v.children, path)}</View>
          </Fragment>
        }
        return null
      })}
    </>
  }
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };
  const handleBeforeInput = (event) => {
    if (isComposing) {
      return
    }
    event.preventDefault();
    const section = window.getSelection()
    if (section && section.rangeCount > -1) {
      console.log(section.anchorNode);
      const parent = section.anchorNode?.parentNode
      const path = parent?.dataset.path.split(',')
      const newPath = path.reduce((acc, current, index) => {
        acc.push(current);
        if (index < path.length - 1) {
          acc.push('children'); // 只在不是最后一个元素后插入
        }
        return acc;
      }, []);
      const data = fromJS(schema);
      const newData = data.updateIn([...newPath, 'text'], val => val + event.data);
      setSchema(newData.toJS())
    }
  };
  return <div className='p-[100px] bg-[#f5f6f7]'>
    <div>
      我是&#8203;标题
    </div>
    <div
      className='bg-white p-5 min-h-[100vh] outline-none rounded-none'
      contentEditable
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onBeforeInput={handleBeforeInput}
      ref={containerRef}
    >
      {renderContent(schema)}
      <div
        className='outline-none rounded-none overflow-hidden'
        style={{minWidth: '1px', display: 'inline-block'}}
        data-base="caret"
      >&#8203;</div>

      <h1>我是标题</h1>
    </div>
  </div>
}


export default Home;
