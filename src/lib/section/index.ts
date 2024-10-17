import Schema from './schema';
import { EditorChild, NodeId } from './type';

interface EditorParams {
  nodeList: EditorChild[]
}

interface RangePoint {
  id: NodeId,
  offset: number
}

interface Editor{
  schema: Schema<NodeId, EditorChild, 'id'>,
  selection: {
    isCollapsed: boolean,
    anchor: RangePoint,
    focus: RangePoint,
  } | null,
  getCurrentId: () => NodeId | null,
  insertText: (text: string) => void
}

export const createEditor = (params: EditorParams): Editor => {
  const { nodeList = [] } = params
  const editor: Editor = {
    schema: new Schema(nodeList, 'id'),
    selection: null,
    getCurrentId() {
      if (editor.selection?.isCollapsed) {
        return editor.selection.anchor.id
      }
      return null
    },
    insertText(text) {
      const current = editor.getCurrentId()
      if (current) {
        const old = editor.schema.get(current) as EditorChild
        editor.schema.update(current, {
          ...old,
          text: old.text + text
        })
      }
    },
    // getNodeId(dom) {

    // },
    // insertNode(node: EditorChild) {

    // },
    // deleteText() {

    // }
  }
  const handleSelectionchange = () => {
    const selection = document.getSelection();
    if (selection?.rangeCount) {
      const anchor = selection.anchorNode
      const anchorId = (anchor?.parentNode as HTMLElement).dataset.fuId as NodeId

      const focus = selection.anchorNode
      const focusId = (focus?.parentNode as HTMLElement).dataset.fuId as NodeId

      editor.selection = {
        isCollapsed: selection.isCollapsed,
        anchor: { id: anchorId, offset: selection.anchorOffset },
        focus: { id: focusId, offset: selection.focusOffset },
      }
    } else {
      editor.selection = null
    }
  }
  document.addEventListener('selectionchange', handleSelectionchange)

  return editor
}
