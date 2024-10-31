import React, { useMemo } from 'react';
import {
  createEditor,
  Descendant,
  Transforms,
  Editor,
  Element as SlateElement,
  Range,
  Point,
  Path
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps
} from 'slate-react';

import View from './View';
import Image from './Image';

import picDemo from '@/assets/images/demo.jpg'


interface CustomElement<ExtraFields = unknown> {
  type: 'view' | 'img' | 'link',
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
  const { attributes, children, element } = props
  switch (element.type) {
    case 'view':
      return <View {...props} />
    case 'img':
      return <Image {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Home = () => {

  const withFu = editor => {
    const { 
      deleteBackward,
      deleteForward,
      insertBreak,
      isInline,
      normalizeNode,
      isVoid,
      move
    } = editor

    // editor.deleteBackward = unit => {
    //   const { selection } = editor
    //   if (selection && Range.isCollapsed(selection)) {
    //     const [cell] = Editor.nodes(editor, {
    //       match: n =>
    //         !Editor.isEditor(n) &&
    //         SlateElement.isElement(n) &&
    //         n.type === 'view',
    //     })  
    //     if (cell) {
    //       const [, cellPath] = cell
    //       const end = Editor.end(editor, cellPath)
  
    //       if (Point.equals(selection.anchor, end)) {
    //         return
    //       }
    //     }
    //   }
  
    //   deleteBackward(unit)
    // }

    // editor.move = (options) => {
    //   // console.log('options', options);
    //   // const { selection } = editor;
    //   // if (selection && Range.isCollapsed(selection)) {
    //   //   const path = selection.anchor.path; // 获取光标位置的路径
    //     // Transforms.move(editor, { edge: 'anchor' })
    //     // 根据路径获取当前节点
    //     // const [currentNode] = Editor.node(editor, path);

    //     // console.log('currentNode', Path.previous(path));
      
    //     // 如果光标在 void 节点前面，向前移动两步
    //     // if (match) {
    //     //   Transforms.move(editor, { distance: 1, unit: 'offset' });
    //     //   return; // 不调用默认的 move 方法
    //     // }
    //   // }
    //   move(options);
    // }

    editor.normalizeNode = (entry) => {
      console.log('entry', entry);

      return editor
    }

    editor.isInline = element => {
      // 如果是自定义的 'view'，它是块级元素，返回 false
      // return element.type === 'view' ? false : isInline(element);

      if (element.type === 'img') {
        return true
      }

      return isInline(element)
    };

    editor.isVoid = element => {
      if (element.type === 'img') {
        return true
      }

      return isVoid(element)
    }
    return editor
  }

  const editor = useMemo(() => withFu(withReact(createEditor())), []);

  const initialValue: CustomElement[] = [
    {
      type: 'view',
      children: [
        { text: '我是文本节点' },
        {
          type: 'view',
          children: [
            { text: '我是文本节点1' },
          ],
        },
        {
          type: 'view',
          children: [
            { text: '我是文本节点2' },
          ],
        },
        { text: '我是文本节点3' },
        {
          type: 'img',
          url: picDemo,
          children: [{ text: '' }],
        },
        { text: '我是文本节点4' },
      ],
    },
  ]

  const handlerChange = (val: any) => {
    console.log(val);
  }


  const handlerKeyDown = (event) => {
    console.log(event.key);
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      Transforms.move(editor, { unit: 'offset', reverse: true })
      return
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      Transforms.move(editor, { unit: 'offset' })
      return
    }

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
            onKeyDown={handlerKeyDown}
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
