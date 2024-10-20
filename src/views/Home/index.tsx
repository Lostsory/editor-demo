import React, { useMemo } from 'react';
import { createEditor, Descendant, Transforms, Editor, Element as SlateElement, Range, Point } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';



const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    className='font-0'
  >
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)

const EditableButtonComponent = ({ attributes, children }) => {
  return (
    /*
      Note that this is not a true button, but a span with button-like CSS.
      True buttons are display:inline-block, but Chrome and Safari
      have a bad bug with display:inline-block inside contenteditable:
      - https://bugs.webkit.org/show_bug.cgi?id=105898
      - https://bugs.chromium.org/p/chromium/issues/detail?id=1088403
      Worse, one cannot override the display property: https://github.com/w3c/csswg-drafts/issues/3226
      The only current workaround is to emulate the appearance of a display:inline button using CSS.
    */
    <span
      {...attributes}
      onClick={ev => ev.preventDefault()}
      // Margin is necessary to clearly show the cursor adjacent to the button
      style={{
        margin: '0 0.1em',
        backgroundColor: '#efefef',
        padding: '2px 6px',
        border: '1px solid #767676',
        borderRadius: '2px',
        fontSize: '0.9em,'
      }}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </span>
  )
}

const Text = props => {
  const { attributes, children, leaf } = props
  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      style={{paddingLeft: '0.1px'}}
      {...attributes}
    >
      {children}
    </span>
  )
}

const Element = props => {
  const { attributes, children, element } = props
  switch (element.type) {
    // case 'button':
    //   return <span className='inline rounded-[5px] bg-[#000] text-[#fff] pl-[10px] pr-[10px]' {...attributes}>
    //     <InlineChromiumBugfix/>
    //     {children}
    //     <InlineChromiumBugfix/>
    //   </span>
    case 'button':
      return <EditableButtonComponent {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Home = () => {
  

  const withTables = editor => {
    const { deleteBackward, deleteForward, insertBreak, isInline  } = editor
  
    // editor.insertBreak = () => {
    //   const { selection } = editor
  
    //   if (selection) {
    //     const [table] = Editor.nodes(editor, {
    //       match: n =>
    //         !Editor.isEditor(n) &&
    //         SlateElement.isElement(n) &&
    //         n.type === 'button',
    //     })


  
    //     console.log('table', table);

    //     if (table) {
    //       Transforms.move(editor, { unit: 'block' });
    //       return
    //     }
    //   }
  
    //   insertBreak()
    // }

    editor.isInline = element => {
      console.log('element', element);
      return ['link', 'button', 'badge'].includes(element.type) || isInline(element)
    }

    return editor
  }

  const editor = useMemo(() => withTables(withReact(createEditor())), []);

  // const initialValue: Descendant[] = [
    // {
    //   type: 'paragraph',
    //   children: [
    //     { text: 'This is editable plain text, just like a <textarea>!' },
    //     {
    //       type: 'button',
    //       children: [{ text: 'editable button' }],
    //     },
    //     { text: 'This is editable plain text, just like a <textarea>!', bold: true },
    //   ],
    // },
    // {
    //   type: 'button',
    //   children: [
    //     { text: '按钮' },
    //   ],
    // },
    // {
    //   type: 'paragraph',
    //   children: [
    //     { text: 'This is editable plain text, just like a <textarea>!' },
    //     { text: 'This is editable plain text, just like a <textarea>!', bold: true },
    //   ],
    // },
  // ];
  const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]

  const renderPlaceholder = () => {
    return <span className="custom-placeholder">请输入一些文本...</span>;
  };

  const a = ({ attributes, children }) => <div {...attributes} className="custom-placeholder">{ children }</div>

  const handlerChange = (val) => {
    console.log(val);
  }

  return (
    <div className='p-[100px] bg-[#f5f6f7]'>
      <div className='bg-white min-h-[100vh]'>
        <Slate
          editor={editor}
          initialValue={initialValue}
          onChange={(val) => console.log(val)}
        >
          <Editable
            className=' outline-none rounded-none'
            // placeholder='请输入一些文本...'
            // renderPlaceholder={renderPlaceholder}
            placeholder="Type something"
        renderPlaceholder={({ children, attributes }) => (
          <div {...attributes}>
            <p>{children}</p>
            <pre>
              Use the renderPlaceholder prop to customize rendering of the
              placeholder
            </pre>
          </div>
        )}
            renderElement={props => <Element {...props} />}
            renderLeaf={props => <Text {...props} />}
            onChange={handlerChange}
          >
          </Editable>
        </Slate>
      </div>
      
    </div>
  );
};

export default Home;
