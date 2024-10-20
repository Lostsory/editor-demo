import { NodeList } from './node';
import Range from './range';
import { EditorChild } from './type';

const ZERO_WIDTH_SPACE = '\u200B';

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

let callbacks: Function[] = [];
let pending: boolean = false;

const flushCallback = () => {
  pending = false;
  callbacks.forEach(fn => fn());
  callbacks = []
};

const timerFunc = () => {
  Promise.resolve().then(() => {
    flushCallback()
  })
}

const nextTick = (fn: Function) => {
  callbacks.push(fn)
  if (!pending) {
    pending = true
    timerFunc()
  }
}

export default class Editor{
  data: EditorChild[]
  nodeList: NodeList
  range: Range | null
  isComposing: boolean
  onChange: (type: OperationType) => void

  constructor(params: EditorParams) {
    const {data = [], onChange} = params
    this.data = data
    this.nodeList = new NodeList(data)
    this.range = null
    this.isComposing = false

    this.onChange = (type: OperationType) => {
      onChange({
        type,
        data: [...this.data]
      })
    }
  }

  setDate(data: EditorChild[]) {
    this.data = data
    this.nodeList = new NodeList(data)
  }
  
  setIsComposing(bool: boolean) {
    this.isComposing = bool
  }

  insertText(text: string) {

    if (!this.range) return

    if (this.range.isSingleNode()) {

      const { focus, anchor } = this.range;

      const node = this.nodeList.getNodeById(focus.id)
    
      const oldText = node?.data.text || ''

      const isForward = this.range.isForward()

      const start = isForward ? focus.offset : anchor.offset
      const end = isForward ? anchor.offset : focus.offset

      const newText = oldText.substring(0, start) + text + oldText.substring(end)
  
      this.nodeList.updateNode(focus.id, {
        text: newText
      })

      this.range.updateAnchor((val) => ({...val, offset: start + text.length}))
      this.range.updateFocus((val) => ({...val, offset: start + text.length}))

      this.onChange(OperationType.INSERT_TEXT)
    } else {
      // TODO 跨节点插入文字
    }
  }

  deleteText() {
    if (!this.range) return

    if (this.range.isSingleNode()) {
        
      const { focus, anchor } = this.range;

      const node = this.nodeList.getNodeById(focus.id)
    
      const oldText = node?.data.text || ''
      
      if (oldText === ZERO_WIDTH_SPACE && node) {
        // const prvesibling = this.nodeList.getPrvesibling(node)
        // this.nodeList.deleteNode(focus.id)
        // this.range = new Range()
        return
      }

      const start = this.range.isForward() ? focus.offset : anchor.offset
      const end = this.range.isForward() ? anchor.offset : focus.offset

      let newText = ''
      let newOffset = 0
      if (this.range.isCollapsed()) {
        newText = oldText.substring(0, start -1) + oldText.substring(end)
        newOffset = start - 1
      } else {
        newText = oldText.substring(0, start) + oldText.substring(end)
        newOffset = start
      }

      this.nodeList.updateNode(focus.id, {
        text: newText.length === 0 ? ZERO_WIDTH_SPACE : newText
      })

      // if (newText.length === 0) {
      //   this.
      // }

      this.range.updateAnchor((val) => ({...val, offset: newOffset}))
      this.range.updateFocus((val) => ({...val, offset: newOffset}))

      this.onChange(OperationType.DELETE_TEXT)
    } else {
      // TODO 跨节点删除文字
    }
  }

  updateRangeToWindow() {
    if (!this.range) return 
    const {focus, anchor} = this.range

    const selection = window.getSelection() as Selection
    const range = document.createRange()
    range.setEnd(focus.node, focus.offset)
    range.setStart(anchor.node, anchor.offset)

    selection.removeAllRanges()
    selection.addRange(range)
  }

  updateRangeToEditor() {
    const sel  = window.getSelection()
    if (this.isComposing) return
    if (sel?.rangeCount) {
      // const range = sel.getRangeAt(0)
      const {anchorOffset, focusOffset, anchorNode, focusNode} = sel
      if (anchorNode && focusNode) {
        this.range = new Range({
          anchor: {
            id: (anchorNode.parentNode as HTMLElement).dataset.fuId as string,
            offset: anchorOffset,
            node: anchorNode
          },
          focus: {
            id: (focusNode.parentNode as HTMLElement).dataset.fuId as string,
            offset: focusOffset,
            node: focusNode
          },
        })
        console.log('current range', this.range);
      } else {
        this.range = null
      }
      
    } else {
      this.range = null
    }
  }

}


export * from './type'
