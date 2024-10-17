import { List } from 'immutable';
import { EditorChild, Path } from './type';

enum OperationType{
  INSERT_TEXT,
  DELETE_TEXT
}

interface EditorParams {
  data?: EditorChild[],
  onChange: (type: OperationType) => void
}

interface EditorRange{
  collapsed: boolean,
  focus: {
    path: Path,
    offset: number,
    node: Node
  },
  anchor: {
    path: Path,
    offset: number,
    node: Node
  }
}

export interface Editor{
  data: List<EditorChild>,
  range: EditorRange | null,
  insertText: (text: string) => void,
  deleteText: () => void,
  setRange: (range: Range | null) => void,
}

export const createEditor = (params: EditorParams): Editor => {
  const { data = [], onChange } = params
  const editor: Editor = {
    data: List(data),
    range: null,
    insertText(text) {
      if (editor.range) {
        const { focus: {path, offset} } = editor.range;
        const updatePath = path.reduce<(string| number)[]>((acc, current, index) => {
          acc.push(current);
          if (index < path.length - 1) {
            acc.push('children');
          }
          return acc;
        }, [])

        updatePath.push('text')

        editor.range.anchor.offset += text.length
        editor.range.focus.offset += text.length

        editor.data = editor.data.updateIn(updatePath, (val: any) => {
          if (offset === val.length) {
            return val + text
          }
          return val.substring(0, offset) + text + val.substring(offset);
        })

        onChange(OperationType.INSERT_TEXT)
      }
    },
    deleteText() {
      if (editor.range) {
        const { focus: {path, offset} } = editor.range;
        const updatePath = path.reduce<(string| number)[]>((acc, current, index) => {
          acc.push(current);
          if (index < path.length - 1) {
            acc.push('children');
          }
          return acc;
        }, [])

        updatePath.push('text')

        editor.range.anchor.offset--
        editor.range.focus.offset--

        if (editor.range.anchor.offset === 0) {
          editor.data = editor.data.deleteIn(updatePath)
        } else {
          editor.data = editor.data.updateIn(updatePath, (val: any) => {
            return val.slice(0, -1);
          })  
        }
        onChange(OperationType.DELETE_TEXT)
      }
    },
    setRange(range) {
      console.log(range);
      if (range) {
        const {startContainer, endContainer, startOffset, endOffset} = range
        editor.range = {
          collapsed: range.collapsed,
          focus: {
            path: (startContainer.parentNode as HTMLElement).dataset.path?.split(',') as Path,
            offset: startOffset,
            node: startContainer,
          },
          anchor: {
            path: (endContainer.parentNode as HTMLElement).dataset.path?.split(',') as Path,
            offset: endOffset,
            node: endContainer,
          }
        }
      } else {
        editor.range = null
      }
      
    },
    // getPath(dom) {

    // },
    // insertNode(node: EditorChild) {

    // },
    // deleteText() {

    // }
  }
  return editor
}
