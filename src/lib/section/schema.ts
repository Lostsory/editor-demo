class Schema<K, V, C extends keyof V>{
  private map: Map<K, Node<V>>;
  private list: DoublyLinkedList<V>;

  constructor(defaultData: Array<V> = [], key: C) {
    this.map = new Map();
    this.list = new DoublyLinkedList();

    defaultData.forEach((data) => {
      this.insert(data[key] as K, data);
    })
  }

  insert(key: K, value: V): void {
    if (!this.map.has(key)) {
      const newNode = this.list.insertAtTail(value);
      this.map.set(key, newNode);
    }
  }

  get(key: K): V | undefined {
    return this.map.get(key)?.data
  }

  delete(key: K): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      this.list.removeNode(node);
      this.map.delete(key);
    }
  }

  update(key: K, newValue: V): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.data = newValue;
    }
  }
}

class Node<T> {
  data: T;
  prev: Node<T> | null;
  next: Node<T> | null;

  constructor(data: T, prev: Node<T> | null = null, next: Node<T> | null = null) {
    this.data = data;
    this.prev = prev;
    this.next = next;
  }
}

class DoublyLinkedList< V> {
  private head: Node<V> | null;
  private tail: Node<V> | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  insertAtTail(data: V): Node<V> {
    const newNode = new Node(data, this.tail, null);

    if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;

    if (!this.head) {
      this.head = newNode;
    }

    return newNode;
  }

  removeNode(node: Node<V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }
}

export default Schema
