import React, { createElement, forwardRef, Fragment, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import Editor from '@/lib/editor';
import { EditorChild, Path } from '@/lib/editor';

import View from '@/components/fu/View';
import Text from '@/components/fu/Text';

function Home() {

  const [list, setList] = useState<EditorChild[]>([
    {
      type: 'Text',
      text: 'text',
      id: '1',
    },
    {
      type: 'View',
      id: '2',
      children: [
        {
          id: '2-1',
          type: 'Text',
          text: 'text1'
        },
        {
          id: '2-2',
          type: 'Text',
          text: 'text2'
        },
      ]
    },
  ])

  const editor = useRef<Editor>(new Editor({
    onChange({ type, data }) {
      setList(data)
    },
  }))

  useEffect(() => {
    editor.current.setDate(list)
    
    document.addEventListener('selectionchange', handleSelectionchange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionchange)
    }
  }, [])

  useEffect(() => {
    editor.current.updateRangeToWindow()
  }, [list])

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSelectionchange = () => {
    editor.current.updateRangeToEditor()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (editor.current.isComposing) {
      // 如果正在进行组合输入，阻止空格键或其他键的默认行为
      event.preventDefault()
    }

    // 检测删除键的按下
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      editor.current.deleteText()
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
              data-fu-id={v.id}
            >{v.text}</Text>
          </Fragment>
        }
        if (v.type === 'View') {
          return <Fragment key={i}>
            <View
              data-fu-id={v.id}
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
    console.log('handleCompositionStart');
    // setIsComposing(true);
    editor.current.setIsComposing(true)
  };

  const handleCompositionEnd = (event) => {
    console.log('handleCompositionEnd');
    // setIsComposing(false);
    editor.current.setIsComposing(false)
    editor.current.insertText(event.data)
  };
  const handleBeforeInput = (event) => {
    console.log('handleBeforeInput');
    if (editor.current.isComposing) {
      return
    }
    editor.current.insertText(event.data)
    event.preventDefault();
  };
  return <div className='p-[100px] bg-[#f5f6f7]'>
    <div
      className='bg-white p-5 min-h-[100vh] outline-none rounded-none whitespace-pre-wrap'
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
    <Fragment key="111">我是一个人</Fragment>
    <div className='w-[200px] h-[200px] bg-[red]'></div>
  </div>
}


export default Home;
