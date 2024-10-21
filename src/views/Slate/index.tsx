// Import React dependencies.
import React, { useCallback, useState } from 'react'
// Import the Slate editor factory.
import { createEditor, Editor, Element, Node, Transforms } from 'slate'

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
  return <p {...props.attributes}>{props.children}</p>
}

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.2' }],
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
    console.log('Node.get(value, path)', Node.get('type', [1]));
  }

  return <Slate
    editor={editor}
    initialValue={initialValue}
    onChange={value => {
      console.log('val', value);
      const isAstChange = editor.operations.some(
        op => 'set_selection' !== op.type
      )
      if (isAstChange) {
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
        Bold
      </Button>
    </div>
    <Editable
      renderLeaf={renderLeaf}
      renderElement={renderElement}
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
}

export default App