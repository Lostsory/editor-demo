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

  getPrvesibling() {
    let current = this.return?.child;
    while (current && current.sibling !== this) {
      current = current.sibling;
    }
    return current || null
  }
}

export type FuNode = Node<EditorChild>

export class NodeList{

  map: Map<NodeId, FuNode>
  rootNode: FuNode

  constructor() {
    this.map = new Map()
    this.rootNode = new Node({
      id: nanoid(),
      type: 'root',
      children: []
    })
    this.map.set(this.rootNode.data.id, this.rootNode)
  }

  get data() {
    return this.rootNode.data.children as EditorChild[]
  }

  addChildren(children: EditorChild[], parent: FuNode = this.rootNode ) {

    (parent.data.children as EditorChild[]).push(...children)
    this.generateChildrenNode(children, parent)

  }
  generateChildrenNode(children: EditorChild[], parent: FuNode = this.rootNode) {
    let previousNode = null;
    for (const child of children) {
      const childNode = new Node(child)
      childNode.return = parent
      this.map.set(child.id, childNode)
      if (Array.isArray(child.children)) {
        this.generateChildrenNode(child.children, childNode)
      }
      if (!parent.child) {
        parent.child = childNode;
      } else {
        (previousNode as FuNode).sibling = childNode;
      }
      previousNode = childNode;
    }
  }

  generateNodeNode(data: EditorChild, returnNode: FuNode) {
    const node = new Node(data);
    node.return = returnNode;

    this.map.set(data.id, node)
    if (Array.isArray(data.children) && data.children.length > 0) {
      let previousNode = null;
      for (const child of data.children) {
        const childNode = this.generateNodeNode(child, node);
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
    return this.map.get(id) || null
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




