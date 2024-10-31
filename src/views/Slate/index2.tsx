// Import React dependencies.
import React, { useCallback, useState } from 'react'
// Import the Slate editor factory.
import { createEditor, Editor, Element, Node, Range, Text, Transforms } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

import { Button } from '@/components/ui/button';

// Define a React component renderer for our code blocks.
const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <div {...props.attributes}>{props.children}</div>
}

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '这是第一段文本。' }],
  },
  {
    type: 'block-quote',
    children: [{ text: '这是一个引用块。' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '这是最后一段文本。' }],
  },
]

const CustomEditor = {
  isBoldMarkActive(editor) {
    const marks = Editor.marks(editor)
    return marks ? marks.bold === true : false
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    })
    console.log('match', match);

    return !!match
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    if (isActive) {
      Editor.removeMark(editor, 'bold')
    } else {
      Editor.addMark(editor, 'bold', true)
    }
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : 'code' },
      { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
    )
  },
}



const App = () => {
  const [editor] = useState(() => withReact(createEditor()))

  const renderElement = props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }

  // Define a React component to render leaves with bold text.
  const renderLeaf = props => {
    return (
      <span
        {...props.attributes}
        style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
      >
        {props.children}
      </span>
    )
  }

  const logSomething = () => {
    // 删除文本节点
    // Transforms.delete(editor, {
    //   at: [0, 0]
    // })

    // 删除节点
    // Transforms.removeNodes(editor, {
    //   at: [0]
    // })

    // Transforms.select(editor, [0])

    // console.log(Editor.end(editor, [0, 0]));

    // console.log(Editor.fragment(editor, {
    //   anchor: Editor.end(editor, [0, 0]),
    //   focus: Editor.end(editor, [1, 0]),
    // }));

    for (const [node, path] of Editor.nodes(editor, { at: range })) {
      // ...
    }
    
  }

  return <div className='p-[100px]'>
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={value => {
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        )
        if (isAstChange) {
          console.log('111');
          // Transforms.select(editor, {
          //   anchor: { path: [0, 0], offset: 2 },  // 选区的起点
          //   focus: { path: [0, 0], offset: 2 } 
          // })
          // Save the value to Local Storage.
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}
    >
      <div>
        <Button
          onClick={event => {
            event.preventDefault()
            CustomEditor.toggleBoldMark(editor)
          }}
          className='mr-[10px]'
        >
          Bold
        </Button>
        <Button
          onClick={event => {
            event.preventDefault()
            CustomEditor.toggleCodeBlock(editor)
          }}
          className='mr-[10px]'
        >
          Code Block
        </Button>
        <Button
          onClick={logSomething}
          className='mr-[10px]'
        >
          log
        </Button>
      </div>
      <Editable
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        className='outline-none rounded-none'
        onKeyDown={event => {

          if (!event.ctrlKey) {
            return
          }

          // Replace the `onKeyDown` logic with our new commands.
          switch (event.key) {
            case '`': {
              event.preventDefault()
              CustomEditor.toggleCodeBlock(editor)
              // const [match] = Editor.nodes(editor, {
              //   match: n => n.type === 'code',
              // })
              // // Toggle the block type depending on whether there's already a match.
              // Transforms.setNodes(
              //   editor,
              //   { type: match ? 'paragraph' : 'code' },
              //   { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
              // )
              break
            }

            case 'b': {
              event.preventDefault()
              CustomEditor.toggleBoldMark(editor)
              break
            }
          }
        }}
      />
    </Slate>
  </div>
}

export default App