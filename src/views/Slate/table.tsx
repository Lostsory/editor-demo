import React, { useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, useSlate, withReact } from 'slate-react';
import { Transforms, Editor, Path, Element as SlateElement } from 'slate';

// 初始值包含一个默认的 view 节点
const initialValue = [
  {
    type: 'view',
    children: [{ text: 'This is a default view!' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'This is an editable area. ' }],
  },
];

const withCustomElements = (editor) => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection) {
      const [view] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'view',
      });

      // 如果光标在view元素内部
      if (view) {
        // 在view后插入一个新的段落
        Transforms.insertNodes(
          editor,
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
          { at: Path.next(view[1]) } // 插入到view后
        );

        // 移动光标到新插入的段落
        Transforms.select(editor, {
          anchor: { path: Path.next(view[1]), offset: 0 },
          focus: { path: Path.next(view[1]), offset: 0 },
        });
        return; // 结束自定义插入逻辑
      }

      // 检查表格元素
      const [table] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table',
      });

      if (table) {
        // 如果光标在表格内部，防止默认行为
        return;
      }
    }

    // 调用默认的插入换行行为
    insertBreak();
  };

  return editor;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'view':
      return (
        <div style={{ width: '400px', border: '1px solid red', padding: '10px' }}>
          <div {...attributes}>{children}</div>
        </div>
      );
    case 'table':
      return (
        <table style={{ width: '300px', border: '1px solid black' }}>
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const App = () => {
  const editor = useMemo(() => withCustomElements(withReact(createEditor())), []);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={props => <Element {...props} />}
        onKeyDown={event => {
          // 示例：使用 Ctrl + Shift + V 插入一个 view 元素
          if (event.ctrlKey && event.shiftKey && event.key === 'V') {
            event.preventDefault();
            const view = {
              type: 'view',
              children: [{ text: 'This is a custom view!' }],
            };
            Transforms.insertNodes(editor, view);
          }
        }}
      />
    </Slate>
  );
};

export default App;
