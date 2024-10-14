import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import Text from '@/components/fu/Text';
import picDemo from '@/assets/images/demo.png';

function Home() {
  const [texts, setTexts] = useState<string[]>(['请输入', '请输入2', '请输入3']);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {

    // 检测删除键的按下
    // if (event.key === 'Backspace' || event.key === 'Delete') {
    //   const selection = window.getSelection();
    //   if (selection && selection.rangeCount > 0) {
    //     const range = selection.getRangeAt(0);
    //     const startNode = range.startContainer; // 当前光标位置的节点
    //     const startOffset = range.startOffset; // 光标在节点中的偏移量

    //     console.log('startOffset', selection.anchorNode);

    //     if (startNode.nodeType !== Node.TEXT_NODE) {
    //       const prevNode = startNode.previousSibling;
    //       console.log('prevNode', startNode, prevNode);
    //     }
    //     event.preventDefault()
    //   }
    // }
    if (event.key === 'Enter') {
      event.preventDefault();  // 防止在 contentEditable 中默认的换行操作
      setTexts([...texts, '']);  // 添加新的空文本项目
    }
  };
  const handleInput = () => {
    if (containerRef.current) {
      const updatedTexts = Array.from(containerRef.current.children).map(
        (child) => (child as HTMLElement).innerText
      );
      setTexts(updatedTexts);
      console.log('Updated texts:', updatedTexts);
    }
  };
  const change = () => {
    console.log('change');
  }
  return <div className='p-[100px] bg-[#f5f6f7]'>
    <div
      className='bg-white min-h-[100vh] outline-none rounded-none'
      contentEditable
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      ref={containerRef}
    >
      {texts.map((text, index) => (
        <Text key={index} text={text} />
      ))}
    </div>
  </div>
}

export default Home;
