import { NodeId } from "./type"

export interface Rangeslide{
  id: NodeId,
  offset: number,
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
   */
  get isCollapsed() {
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

  updateFocus(params: Partial<Rangeslide> | ((val: Rangeslide) => Partial<Rangeslide>)) {
    Object.assign(this.focus, typeof params === 'function' ? params(this.focus) : params)
  }

  updateAnchor(params: Partial<Rangeslide> | ((val: Rangeslide) => Partial<Rangeslide>)) {
    Object.assign(this.anchor, typeof params === 'function' ? params(this.anchor) : params)
  }

  
}