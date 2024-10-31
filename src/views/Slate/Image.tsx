import { FC } from "react"
import { useFocused, useSelected } from "slate-react"

interface ViewProps{
  align?: 'center'
}

const View: FC<ViewProps> = ({ attributes, children, element }) => {

  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes} style={{display: 'inline-block', border: `1px solid ${focused && selected ? 'red' : 'transparent'}`}} >
      <img src={element.url} alt="Inserted image" style={{ width: '200px', height: 'auto', display: 'inline-block' }} />
      {children}
    </div>
  )
}

export default View
