import { EditorChild, NodeId, Descendant } from "./type";
import { nanoid } from 'nanoid';

export class Node {
  key: NodeId;
  child?: NodeId;
  sibling?: NodeId;
  prevSibling?: NodeId;
  return?: NodeId;

  constructor(data: Descendant, parent?: NodeId) {
    this.key = data.id
    this.return = parent
  }
}

export class NodeList{

  map: Map<string, Node>
  rootNode: Node

  constructor(list: EditorChild[]) {
    this.map = new Map()
    
    this.rootNode = new Node({
      id: 0,
      type: 'root',
    })
    this.generateNodeTree(list, this.rootNode)
  }

  generateNodeTree(data: Descendant[], returnNode: Node) {
    
  }

  // generateNodeTree(data: EditorChild, returnNode: Node<EditorChild | null>) {
  //   const node = new Node(data);
  //   node.return = returnNode as Node<EditorChild>;

  //   this.map.set(data.id, node)
  //   if (data.children && data.children.length > 0) {
  //     let previousNode = null;
  //     for (const child of data.children) {
  //       const childNode = this.generateNodeTree(child, node);
  //       if (!node.child) {
  //         node.child = childNode;
  //       } else {
  //         (previousNode as Node<EditorChild>).sibling = childNode;
  //       }
  //       previousNode = childNode;
  //     }
  //   }

  //   return node;
  // }

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




