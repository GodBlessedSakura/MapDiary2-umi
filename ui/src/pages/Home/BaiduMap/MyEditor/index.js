import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { Md2FormatMessage } from '@/utils/locale'
import styles from './index.less'

function MyEditor(props) {
  // editor 实例
  const [editor, setEditor] = useState(null) // JS 语法
  // 编辑器内容
  const { contents, onContentsChange, readOnly } = props
  console.log('readOnly', readOnly)

  // 工具栏配置
  const toolbarConfig = {} // JS 语法

  // 编辑器配置
  const editorConfig = {
    // JS 语法
    placeholder: readOnly ? '' : Md2FormatMessage('ContentInput'),
    readOnly,
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: readOnly ? 'none' : '1px solid #ccc', zIndex: 100, marginTop: 10 }}>
        {!readOnly && <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: '1px solid #ccc' }} />}
        <Editor defaultConfig={editorConfig} value={contents} onCreated={setEditor} onChange={(editor) => onContentsChange && onContentsChange(editor.getHtml())} mode="default" style={{ height: '500px', overflowY: 'hidden' }} />
      </div>
    </>
  )
}

export default MyEditor
