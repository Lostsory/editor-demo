export type NodeId = string | number

export interface EditorChild{
  id: NodeId,
  parentId?: NodeId,
  type: 'Text' | 'View',
  text?: string,
}
