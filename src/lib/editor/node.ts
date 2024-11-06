import { EditorChild, NodeId } from "./type";
import { nanoid } from 'nanoid';

export class Node<T> {

  // 组件的数据
  data: T;
  // 子节点
  child: Node<T> | null;
  // 兄弟节点
  sibling: Node<T> | null;
  // 父节点
  return: Node<T> | null;

  constructor(data: T) {
    this.data = data
    this.child = null
    this.sibling = null
    this.return = null
  }

  isLeaf() {
    return this.child === null
  }
}

export type FuNode = Node<EditorChild>

export class NodeList{

  map: Map<NodeId, FuNode>
  rootNode: FuNode

  constructor(list: EditorChild[]) {
    this.map = new Map()
    const data: EditorChild = {
      id: nanoid(),
      type: 'root',
      children: list
    }

    this.rootNode = this.generateNodeTree(data)
  }

  get data() {
    return this.rootNode.data.children
  }

  generateNodeTree(data: EditorChild, returnNode?: FuNode) {
    const node = new Node(data);
    node.return = returnNode || null;

    this.map.set(data.id, node)
    if (Array.isArray(data.children) && data.children.length > 0) {
      let previousNode = null;
      for (const child of data.children) {
        const childNode = this.generateNodeTree(child, node);
        if (!node.child) {
          node.child = childNode;
        } else {
          (previousNode as FuNode).sibling = childNode;
        }
        previousNode = childNode;
      }
    }

    return node;
  }

  getNodeById(id: NodeId) {
    return this.map.get(id)
  }

  lastChild(node: FuNode) {
    let ans = node.child as FuNode
    while(ans.sibling) {
      ans = ans.sibling
    }
    return ans
  }

  getPrvesibling(node: FuNode): FuNode | null {
    const parent = node.return || this.rootNode
    let current = parent.child;
    while (current && current.sibling !== node) {
      current = current.sibling;
    }
    return current || null
  }

  updateNodeById(id: NodeId, data: Partial<EditorChild>) {
    const node = this.getNodeById(id)
    if (node) {
      Object.assign(node.data, data)
    } else {
      console.error(`组件id: ${id}不存在`);
    }
  }

  deleteNode(node: FuNode) {
    const parent = node.return || this.rootNode
    if (parent.child === node) {
      parent.child = node.sibling;
    } else {
      const prvesibling = this.getPrvesibling(node)
      if (prvesibling) {
        prvesibling.sibling = node.sibling
      }
    }
    node.child = null;
    node.sibling = null;
    node.return = null;
    parent.data.children = (parent.data.children as EditorChild[]).filter(v => v.id !== node.data.id)
    this.map.delete(node.data.id)
  }
}




