import React, { createElement, forwardRef, Fragment, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { createEditor, Editor } from '@/lib/editor';
import { EditorChild, Path } from '@/lib/editor/type';

import View from '@/components/fu/View';
import Text from '@/components/fu/Text';


function Home() {
  
  const [list, setList] = useState<EditorChild[]>([
    {
      type: 'Text',
      text: 'text'
    },
    {
      type: 'View',
      children: [
        {
          type: 'Text',
          text: 'text1'
        },
        {
          type: 'Text',
          text: 'text2'
        },
      ]
    },
  ])

  const editorChildrefs = useRef<Map<string, any>>(new Map())

  const editor = useRef<Editor>()

  const selection = useRef(window.getSelection())

  const [isComposing, setIsComposing] = useState<boolean>(false)

  useEffect(() => {
    editor.current = createEditor({
      data: list,
      onChange: (type) => {
        setList(editor.current?.data.toJS() as EditorChild[]) 
      }
    })
    document.addEventListener('selectionchange', handleSelectionchange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionchange)
    }
  }, [])

  useEffect(() => {
    
    if (editor.current?.range && selection.current) {
      const {focus, anchor} = editor.current.range
      selection.current.removeAllRanges()
      const range = document.createRange()
      range.setEnd(focus.node, focus.offset)
      range.setStart(anchor.node, anchor.offset)
      selection.current.addRange(range)
      editor.current.setRange(range)
    }
    
  }, [list])

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSelectionchange = () => {
    const selection = document.getSelection();
    if (selection?.rangeCount) {
      editor.current?.setRange(selection.getRangeAt(0))
    } else {
      editor.current?.setRange(null)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    
    // 检测删除键的按下
    if (event.key === 'Backspace' || event.key === 'Delete') {
        const currentNode = range.startContainer;
      event.preventDefault()
      editor.current?.deleteText()
    }
    if (event.key === 'Enter') {
      // event.preventDefault();  // 防止在 contentEditable 中默认的换行操作
    }
  };
  const renderContent = (list: EditorChild[], p: Path = []): ReactNode => {
    return <>
      {list.map((v, i) => {
        const path = [...p, i]
        if (v.type === 'Text') {
          return <Fragment key={i}>
            <Text
              ref={(ref: any) => editorChildrefs.current.set(path.join(','), ref)}
              data-path={path}
            >{v.text}</Text>
          </Fragment>
        }
        if (v.type === 'View') {
          return <Fragment key={i}>
            <View
              ref={(ref: any) => editorChildrefs.current.set(path.join(','), ref)}
              data-path={path}
            >
              {v.children && renderContent(v.children, path)}
            </View>
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
    editor.current?.insertText(event.data)
    event.preventDefault();
  };
  return <div className='p-[100px] bg-[#f5f6f7]'>
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
      {renderContent(list)}
      {/* <div
        className='outline-none rounded-none overflow-hidden'
        style={{minWidth: '1px', display: 'inline-block'}}
        data-base="caret"
      >&#8203;</div> */}

      {/* <h1>我是标题</h1> */}
    </div>
  </div>
}


export default Home;
