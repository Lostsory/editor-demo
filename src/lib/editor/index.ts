import { FuNode, Node, NodeList } from './node';
import Range, { Rangeslide } from './range';
import { EditorChild, NodeId } from './type';

const ZERO_WIDTH_SPACE = '\u200B';

enum OperationType{
  INSERT_TEXT,
  DELETE_TEXT,
  DELETE_NODE,
  /**
   * 光标移动
   */
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

      this.range.updateAnchor((val) => ({offset: start + text.length}))
      this.range.updateFocus((val) => ({offset: start + text.length}))

      this.onChange(OperationType.INSERT_TEXT)
    } else {
      // TODO 跨节点插入文字
    }
  }

  deleteText() {
    if (!this.range) return

    if (this.range.isSingleNode()) {

      const { focus, anchor } = this.range;

      const node = this.nodeList.getNodeById(focus.id) as FuNode

      if (!node.isLeaf()) {
        return this.deleteNode(focus.id)
      }

      const oldText = (node?.data.children || '') as string

      const start = this.range.isForward() ? focus.offset : anchor.offset
      const end = this.range.isForward() ? anchor.offset : focus.offset

      if (start === end && start === 0) return

      let newText = ''
      let newOffset = 0
      if (this.range.isCollapsed) {
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

      this.range.updateAnchor({offset: newOffset})
      this.range.updateFocus({offset: newOffset})

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

    const prvesibling = node.getPrvesibling()
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
    console.warn('range', this.range);
  }


  moveNodeBackward(node: FuNode) {
    let cur = node
    let prvesibling = null
    while(!prvesibling && cur) {
      prvesibling = cur.getPrvesibling()
      cur = cur.return as FuNode
    }
    return prvesibling
  }

  moveCaret(backward: boolean) {

    if (!this.range?.isCollapsed) return

    const node = this.nodeList.getNodeById(this.range.focus.id) as FuNode
    if (backward) {
      // debugger
      if (node.isLeaf()) {
        if (this.range.focus.offset > 0) {
          this.range.updateAnchor((val) => ({offset: --val.offset}))
          this.range.updateFocus((val) => ({offset: --val.offset}))
        } else {
          let cur = node
          let prvesibling = null
          while(!prvesibling && cur) {
            prvesibling = cur.getPrvesibling()
            cur = cur.return as FuNode
          }

          if (!prvesibling) return

          let offset = 0
          if (prvesibling.isLeaf() && prvesibling.data.void !== 1) {
            if (prvesibling.sibling === node) {
              offset = (prvesibling.data.children as EditorChild[]).length - 1
            } else {
              offset = (prvesibling.data.children as EditorChild[]).length
            }
          }

          this.setRange({
            focus: {
              id: prvesibling.data.id,
              offset
            },
            anchor: {
              id: prvesibling.data.id,
              offset
            }
          })
        }
      } else {
        this.setRangeEnd(node)
      }

    } else {
      if (node.isLeaf()) {
        if (this.range.focus.offset < node.data.children.length) {
          this.range.updateAnchor((val) => ({offset: ++val.offset}))
          this.range.updateFocus((val) => ({offset: ++val.offset}))
        } else {
          let cur = node
          let sibling = null
          while(!sibling && cur) {
            sibling = cur.sibling
            cur = cur.return as FuNode
          }

          if (!sibling) return

          let offset = 0
          if (sibling.isLeaf()) {
            if (node.sibling === sibling) {
              offset = 1
            } else {
              offset = 0
            }
          }
          this.setRange({
            focus: {
              id: sibling.data.id,
              offset
            },
            anchor: {
              id: sibling.data.id,
              offset
            }
          })
        }
      } else {
        this.setRangeStart(node)
      }
    }
    this.onChange(OperationType.MOVE_CARET)

  }

  setRangeEnd(node: FuNode) {
    let ans = node.child as FuNode
    while(ans.sibling) {
      ans = ans.sibling
    }
    let offset = 0
    if (ans.isLeaf()) {
      offset = ans.data.children.length
    }
    this.setRange({
      focus: {
        id: ans.data.id,
        offset
      },
      anchor: {
        id: ans.data.id,
        offset
      }
    })
  }

  setRangeStart(node: FuNode) {
    let ans = node.child as FuNode
    this.setRange({
      focus: {
        id: ans.data.id,
        offset: 0
      },
      anchor: {
        id: ans.data.id,
        offset: 0
      }
    })
    console.log('setRangeStart', this.range);
  }

}


export * from './type'
