import { NodeList } from './node';
import { EditorChild } from './type';

enum OperationType{
  INSERT_TEXT,
  DELETE_TEXT
}

interface EditorChange {
  type: OperationType,
  data: EditorChild[],
}

interface EditorParams {
  data?: EditorChild[],
  onChange: (params: EditorChange) => void,
}

interface EditorRange{
  collapsed: boolean,
  focus: {
    id: string,
    offset: number,
    node: Node
  },
  anchor: {
    id: string,
    offset: number,
    node: Node
  }
}

export interface Editor{
  data: EditorChild[],
  nodeList: NodeList,
  range: EditorRange | null,
  insertText: (text: string) => void,
  deleteText: () => void,
  setRange: (range: Range | null) => void,
}

export const createEditor = (params: EditorParams): Editor => {
  const { data = [], onChange } = params
  const editor: Editor = {
    data,
    nodeList: new NodeList(data),
    range: null,
    insertText(text) {
      if (editor.range) {
        const { focus: {id, offset} } = editor.range;

        editor.range.anchor.offset += text.length
        editor.range.focus.offset += text.length

        const node = editor.nodeList.getNodeById(id)

        const oldText = node?.data.text || ''

        const newText = oldText.substring(0, offset) + text + oldText.substring(offset)

        editor.nodeList.updateNode(id, {
          text: newText
        })

        onChange({
          type: OperationType.INSERT_TEXT,
          data: [...editor.data]
        })
        console.log('[...editor.data]', [...editor.data], editor.nodeList);
      }
    },
    deleteText() {
      if (editor.range) {
        const { focus: {id, offset} } = editor.range;

        editor.range.anchor.offset--
        editor.range.focus.offset--

        const node = editor.nodeList.getNodeById(id)

        const oldText = node?.data.text || ''

        editor.nodeList.updateNode(id, {
          text: oldText.slice(0, offset - 1) + oldText.slice(offset)
        })
        onChange({
          type: OperationType.DELETE_TEXT,
          data: [...editor.data]
        })
      }
    },

    setRange(range) {
      if (range) {
        const {startContainer, endContainer, startOffset, endOffset} = range
        editor.range = {
          collapsed: range.collapsed,
          focus: {
            id: (startContainer.parentNode as HTMLElement).dataset.fuId as string,
            offset: startOffset,
            node: startContainer,
          },
          anchor: {
            id: (endContainer.parentNode as HTMLElement).dataset.fuId as string,
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


export * from './type'
