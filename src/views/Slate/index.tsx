import React, { useMemo } from 'react';
import {
  createEditor,
  Descendant,
  Transforms,
  Editor,
  Element as SlateElement,
  Range,
  Point
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps
} from 'slate-react';

import View from './View';


interface CustomElement<ExtraFields = unknown> {
  type: 'div' | 'img' | 'link',
  props?: ExtraFields,
  children: CustomElement<ExtraFields>[];
}

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

const Text = (props: RenderLeafProps) => {
  const { attributes, children } = props
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

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props as
  switch (element.type) {
    case 'block':
      return <View {...element.p} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Home = () => {

  const withFu = editor => {
    const { deleteBackward, deleteForward, insertBreak, isInline  } = editor

    return editor
  }

  const editor = useMemo(() => withFu(withReact(createEditor())), []);

  const initialValue: CustomElement[] = [
    {
      type: 'div',
      children: [
        { text: '我是文本节点1' },
        {
          type: 'paragraph',
          children: [
            { text: '我是文本节点2' },
          ],
        },
      ],
    },
  ]

  const handlerChange = (val: any) => {
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
            className='outline-none rounded-none'
            placeholder="Type something"
            renderPlaceholder={({ children, attributes }) => (
              <div {...attributes}>
               {children}
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
