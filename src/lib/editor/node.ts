import { ReactNode } from "react";
import { EditorChild } from "./type";
import { nanoid } from 'nanoid';

export class Node<T> {

  // 组件的数据
  data: T;
  // 组件实例
  node: ReactNode;
  // 子节点
  child: Node<T> | null;
  // 兄弟节点
  sibling: Node<T> | null;
  // 父节点
  return: Node<T> | null;

  constructor(data: T) {
    this.data = data
    this.node = null
    this.child = null
    this.prevSibling = null
    this.sibling = null
    this.return = null
  }
}

export class NodeList{

  map: Map<string, Node<EditorChild>>
  rootNode: Node<EditorChild>

  constructor(list: EditorChild[]) {
    this.map = new Map()
    const data: EditorChild = {
      id: nanoid(),
      type: 'root',
      children: list
    }
    this.rootNode = this.generateNodeTree(data, new Node(null))
  }

  generateNodeTree(data: EditorChild, returnNode: Node<EditorChild | null>) {
    const node = new Node(data);
    node.return = returnNode as Node<EditorChild>;

    this.map.set(data.id, node)
    if (data.children && data.children.length > 0) {
      let previousNode = null;
      for (const child of data.children) {
        const childNode = this.generateNodeTree(child, node);
        if (!node.child) {
          node.child = childNode;
        } else {
          (previousNode as Node<EditorChild>).sibling = childNode;
        }
        previousNode = childNode;
      }
    }

    return node;
  }

  getNodeById(id: string) {
    return this.map.get(id)
  }

  getPrvesibling(node: Node<EditorChild>): Node<EditorChild> | null {
    const parent = node.return as Node<EditorChild>
    let current = parent.child;
    while (current && current.sibling !== node) {
      current = current.sibling;
    }

    return current || null
  }

  isText(node: Node<EditorChild>) {
    return node.data.type === 'Text'
  }

  updateNode(id: string, data: Partial<EditorChild>) {
    const node = this.getNodeById(id)
    if (node) {
      Object.assign(node.data, data)
    } else {
      console.error(`组件id: ${id}不存在`);
    }
  }

  deleteNode(id: string) {
    const node = this.getNodeById(id)
    if (node) {
      const parent = node.return as Node<EditorChild>
      if (parent.child === node) {
        parent.child = node.sibling;
      } else {
        let current = parent.child;
        while (current && current.sibling !== node) {
          current = current.sibling;
        }

        if (current) {
          current.sibling = node.sibling;
        }
      }
      node.child = null;
      node.sibling = null;
      node.return = null;
    } else {
      console.error(`组件id: ${id}不存在`);
    }
  }

  

}




