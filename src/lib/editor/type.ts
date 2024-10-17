export type NodeId = string | number

export type Path = (string | number)[]

export interface EditorChild{
  type: 'Text' | 'View',
  text?: string,
  children?: EditorChild[]
}
