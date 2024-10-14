import react, { FC, forwardRef } from 'react';

const replaceCaret = (el: HTMLElement) => {
  // Place the caret at the end of the element
  const target = document.createTextNode('');
  el.appendChild(target);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    const sel = window.getSelection();
    if (sel !== null) {
      const range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (el instanceof HTMLElement) el.focus();
  }
}

interface ContentEditableProps{
  children?: React.ReactNode;
}

const ContentEditable = forwardRef<HTMLDivElement, ContentEditableProps>(({
  children
}, ref) => {

  const handleInput = (originalEvt: any) => {
    const el = ref;
    if (!el) return;

    const html = el.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      const evt = Object.assign({}, originalEvt, {
        target: {
          value: html
        }
      });
      this.props.onChange(evt);
    }
    this.lastHtml = html;
  }

  return <div
    ref={ref}
    className="outline-none rounded-none"
    contentEditable
    suppressContentEditableWarning
    onInput={handleInput}
  >
    {children}
  </div>
})

export default ContentEditable
