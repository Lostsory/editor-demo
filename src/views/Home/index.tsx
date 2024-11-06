import React, { createElement, forwardRef, Fragment, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import Editor, { NodeId } from '@/lib/editor';
import hotkeys from '@/lib/editor/utils/hotkeys';
import { EditorChild, Path } from '@/lib/editor';

import { FocusedContext } from './hooks/useFocus';

import View from '@/components/fu/View';
import Text from '@/components/fu/Text';

function Home() {

  const [list, setList] = useState<EditorChild[]>([
    {
      type: 'Text',
      id: '1',
      children: 'text',
    },
    {
      type: 'View',
      id: '2',
      children: [
        {
          id: '2-1',
          type: 'Text',
          children: 'text1',
        },
        {
          type: 'View',
          id: '2-2',
          children: [
            {
              id: '2-2-1',
              type: 'Text',
              children: 'text2-2-1',
            },
            {
              id: '2-2-2',
              type: 'Text',
              children: 'text2-2-2',
            },
          ]
        },
      ]
    },
    {
      id: '3',
      type: 'Text',
      children: 'text3',
    },
  ])

  const nodeMap = useRef<Map<NodeId, React.RefObject<HTMLElement>>>(new Map())

  const editor = useRef<Editor>(new Editor({
    onChange({ type, data }) {
      setList(data)
    },
  }))

  useEffect(() => {
    editor.current.setDate(list)

    document.addEventListener('selectionchange', updateRangeToEditor)
    return () => {
      document.removeEventListener('selectionchange', updateRangeToEditor)
    }
  }, [])

  useEffect(() => {
    updateRangeToWindow()
  }, [list])

  const updateRangeToWindow = () => {
    if (!editor.current.range) return

    const {focus, anchor} = editor.current.range

    const editorFocusNode = editor.current.getNodeById(focus.id)
    const editorAnchorNode = editor.current.getNodeById(focus.id)

    let focusNode = nodeMap.current.get(focus.id)?.current as Node
    let anchorNode = nodeMap.current.get(focus.id)?.current as Node

    if (!editorFocusNode || !editorAnchorNode) return

    if (editorAnchorNode === editorFocusNode && !editorAnchorNode.isLeaf()) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      return
    }

    if (!anchorNode || !focusNode) return

    if (editorAnchorNode.data.type === 'Text') {
      anchorNode = anchorNode.childNodes[1] as Node
    }

    if (editorFocusNode.data.type === 'Text') {
      focusNode = focusNode.childNodes[1] as Node
    }

    if (editorAnchorNode.data.type === 'View') {
      anchorNode = anchorNode.childNodes[1] as Node
    }

    if (editorFocusNode && editorAnchorNode && focusNode && anchorNode) {
      const selection = window.getSelection() as Selection
      const range = document.createRange()
      range.setEnd(focusNode, focus.offset)
      range.setStart(focusNode, anchor.offset)

      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateRangeToEditor = () => {

    const sel  = window.getSelection()

    if (editor.current.isComposing) return

    const currentRange = editor.current.range
    if (currentRange?.isCollapsed && !editor.current.getNodeById(currentRange.focus.id)?.isLeaf()) {
      return
    }

    if (sel?.rangeCount) {

      const {anchorOffset, focusOffset, anchorNode, focusNode} = sel

      console.log('sel', sel);

      if (anchorNode && focusNode) {

        editor.current.setRange({
          anchor: {
            id: (anchorNode.parentNode as HTMLElement).dataset.fuId as string,
            offset: anchorOffset,
          },
          focus: {
            id: (focusNode.parentNode as HTMLElement).dataset.fuId as string,
            offset: focusOffset,
          }
        })

      } else {
        editor.current.setRange(null)
      }
    } else {
      editor.current.setRange(null)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {

    if (hotkeys.isDeleteBackward(event)) {
      event.preventDefault()
      console.log('isDeleteBackward');
      editor.current.deleteText()
    }

    // 检测删除键的按下
    if (hotkeys.isDeleteForward(event)) {
      event.preventDefault()
      console.log('isDeleteForward');
    }

    if (hotkeys.isMoveForward(event)) {
      editor.current.moveCaret(false)
      event.preventDefault()
    }

    if (hotkeys.isMoveBackward(event)) {
      editor.current.moveCaret(true)
      event.preventDefault()
    }

    if (hotkeys.isEnter(event)) {
      console.log('isEnter');
      event.preventDefault();
    }
  };

  const renderContent = (list: EditorChild[], p: Path = []): ReactNode => {
    return <>
      {list.map((v, i) => {
        const path = [...p, i]

        if (!nodeMap.current.has(v.id)) {
          nodeMap.current.set(v.id, React.createRef<HTMLElement>())
        }

        let isSelect = false

        if (editor.current.range?.isCollapsed) {
          isSelect = v.id === editor.current.range.focus.id
        }

        if (v.type === 'Text') {
          return <Fragment key={i}>
            <Text
              ref={nodeMap.current.get(v.id)}
              data-fu-id={v.id}
            >{v.children as string}</Text>
          </Fragment>
        }
        if (v.type === 'View') {
          return <Fragment key={i}>
            <View
              ref={nodeMap.current.get(v.id)}
              data-fu-id={v.id}
              isSelect={isSelect}
            >
              {v.children && renderContent(v.children as EditorChild[], path)}
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
    {/* <FocusedContext.Provider value={{ value, setValue }}>
      
    </MyContext.Provider> */}
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
    </div>
    
  </div>
}


export default Home;
