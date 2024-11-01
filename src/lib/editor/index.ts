import { Node, NodeList } from './node';
import Range, { Rangeslide } from './range';
import { EditorChild, NodeId } from './type';

const ZERO_WIDTH_SPACE = '\u200B';

enum OperationType{
  INSERT_TEXT,
  DELETE_TEXT,
  DELETE_NODE,
  MOVE_CARET,
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
  nodeList: NodeList
  range: Range | null
  isComposing: boolean
  onChange: (type: OperationType) => void

  constructor(params: EditorParams) {
    const {data = [], onChange} = params
    this.nodeList = new NodeList(data)
    this.range = null
    this.isComposing = false

    this.onChange = (type: OperationType) => {
      onChange({
        type,
        data: [...this.nodeList.data] as EditorChild[]
      })
    }
  }

  setDate(data: EditorChild[]) {
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

      const oldText = (node?.data.children || '') as string

      const isForward = this.range.isForward()

      const start = isForward ? focus.offset : anchor.offset
      const end = isForward ? anchor.offset : focus.offset

      const newText = oldText.substring(0, start) + text + oldText.substring(end)

      this.nodeList.updateNodeById(focus.id, {
        children: newText
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

      const oldText = (node?.data.children || '') as string

      // 如果是占位字符，则删除当前节点
      if (oldText === ZERO_WIDTH_SPACE && node) {
        this.deleteNode(focus.id)
        return
      }


      const start = this.range.isForward() ? focus.offset : anchor.offset
      const end = this.range.isForward() ? anchor.offset : focus.offset

      if (start === end && start === 0) return

      let newText = ''
      let newOffset = 0
      if (this.range.isCollapsed()) {
        newText = oldText.substring(0, start -1) + oldText.substring(end)
        newOffset = start - 1
      } else {
        newText = oldText.substring(0, start) + oldText.substring(end)
        newOffset = start
      }

      this.nodeList.updateNodeById(focus.id, {
        children: newText
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

  transfrom({
    node,
    offset = 0
  }: {
    node: Node<EditorChild>,
    offset?: number
  }) {
    this.range = new Range({
      focus: { id: node.data.id, offset },
      anchor: { id: node.data.id, offset },
    })
  }

  getNodeById(id: NodeId) {
    return this.nodeList.getNodeById(id)
  }

  deleteNode(id: NodeId) {

    const node = this.nodeList.getNodeById(id)

    if (!node) return


    const prvesibling = this.nodeList.getPrvesibling(node)
    const sibling = node.sibling
    const parent = node.return

    this.nodeList.deleteNode(node)

    if (prvesibling) {
      this.transfrom({
        node: prvesibling,
        offset: prvesibling.data.children.length
      })
      this.onChange(OperationType.DELETE_NODE)
    } else if (sibling) {
      this.transfrom({
        node: sibling,
        offset: 0
      })
      this.onChange(OperationType.DELETE_NODE)
    } else {
      if (parent) {
        this.deleteNode(parent.data.id)
      }
    }
  }

  setRange(range: {
    focus: Rangeslide,
    anchor: Rangeslide
  } | null) {
    if (range) {
      this.range = new Range(range)
    } else {
      this.range = null
    }
    console.log('range', this.range);
  }

  moveCaret(backward: boolean) {
    const move = backward ? -1 : 1
    if (this.range?.isCollapsed()) {
      this.range.updateAnchor((val) => ({...val, offset: val.offset + move}))
      this.range.updateFocus((val) => ({...val, offset: val.offset + move}))
      this.onChange(OperationType.MOVE_CARET)
      console.log('this.range', this.range);
    }
  }

}


export * from './type'
