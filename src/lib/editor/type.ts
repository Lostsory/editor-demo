export type NodeId = string | number

export interface NodeData{
  id: string,
  parentId: null | string,
  data: EditorChild
}

export type Path = (string | number)[]

export type NodeType = 'root' | 'Text' | 'View'

export interface EditorChild{
  id: string,
  type: NodeType,
  text?: string,
  children?: EditorChild[]
}


