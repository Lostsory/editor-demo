import { FC } from "react"

interface ViewProps{
  align?: 'center'
}

const View: FC<ViewProps> = ({ attributes, children }) => {
  return (
    <div
      {...attributes}
    >
      {children}
    </div>
  )
}

export default View
