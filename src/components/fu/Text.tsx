import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import ContentEditable from 'react-contenteditable'
import { cn } from "@/lib/utils"

function replaceCaret(el: HTMLElement) {
  const target = document.createTextNode('');
  el.appendChild(target);
  const sel = window.getSelection();
  if (sel) {
    const range = document.createRange();
    range.setStart(target, 0);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  el.focus();
}

interface TextProps {
  text: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: string;
  className?: string;
  onSave?: (newText: string) => void;
}

const Text: FC<TextProps> = ({
  text,
  fontSize = '16px',
  fontWeight = 'normal',
  color = '#333',
  textAlign = 'left',
  lineHeight = '1.5',
  className = '',
  onSave,
}) => {
  const [textStyle, setTextStyle] = useState<CSSProperties>({
    fontSize,
    fontWeight,
    color,
    textAlign,
    lineHeight,
  })
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    replaceCaret(divRef.current)
  }, [text]);

  const handleInput = () => {
    console.log('input');
    if (divRef.current) {
      onSave?.(divRef.current.innerText);
    }
  };

  const handleKeyDown = () => {

  }

  return (
    <div
      className="outline-none rounded-none"
      ref={divRef}
      // onInput={handleInput}
      // onKeyDown={handleKeyDown}
      // contentEditable
      // suppressContentEditableWarning
    >
      {text}
    </div>
  )
}

export default Text
