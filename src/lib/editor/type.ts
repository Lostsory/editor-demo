export type NodeId = string | number

export interface NodeData{
  id: string,
  parentId: null | string,
  data: EditorChild
}

export type Path = (string | number)[]

export type NodeType = 'root' | 'Text' | 'View' | 'Image'

export interface EditorChild{
  id: string,
  type: NodeType,
  props?: any,
  // 子元素是否不可以编辑
  void?: 1 | 0,
  children: EditorChild[] | string
}


