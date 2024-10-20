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

interface Rangeslide{
  readonly id: string,
  offset: number,
  readonly node: Node
}


export default class Range{

  /**
   * 结束位置的选区信息
   */
  focus: Rangeslide
  /**
   * 开始位置的选区信息
   */
  anchor: Rangeslide

  constructor({
    focus,
    anchor
  }: {
    focus: Rangeslide,
    anchor: Rangeslide
  }) {
    this.focus = focus
    this.anchor = anchor
  }

  /**
   * 光标是否重合
   * @returns
   */
  isCollapsed() : boolean{
    return this.focus.id === this.anchor.id && this.focus.offset === this.anchor.offset
  }

  /**
   *  选区方向是否从后往前
   * @returns 
   */
  isForward() : boolean{
    return this.focus.offset <= this.anchor.offset
  }

  /**
   * 选区是否在单个节点内
   */
  isSingleNode(): boolean {
    return this.focus.id === this.anchor.id
  }

  updateFocus(params: Rangeslide | ((val: Rangeslide) => Rangeslide)) {
    if (typeof params === 'function') {
      Object.assign(this.focus, params(this.focus))
      console.log('focus', this.focus);
    } else {
      this.focus = params
    }
  }

  updateAnchor(params: Rangeslide | ((val: Rangeslide) => Rangeslide)) {
    if (typeof params === 'function') {
      Object.assign(this.anchor, params(this.anchor))
      console.log('anchor', this.anchor);
    } else {
      this.anchor = params
    }
  }
}