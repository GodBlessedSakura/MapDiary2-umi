import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { DomEditor } from '@wangeditor/editor'
import { Md2FormatMessage } from '@/utils/locale'
import styles from './index.less'

function MyEditor(props) {
  // editor 实例
  const [editor, setEditor] = useState(null) // JS 语法
  // 编辑器内容
  const { contents, onContentsChange, readOnly } = props
  useEffect(() => {
    if (!editor) return
    const toolbar = DomEditor.getToolbar(editor)
    if (!toolbar) return
    toolbar.getConfig().toolbarKeys = [
      'headerSelect',
      'blockquote',
      '|',
      'bold',
      'underline',
      'italic',
      {
        key: 'group-more-style',
        title: '更多',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
        menuKeys: ['through', 'code', 'sup', 'sub', 'clearStyle'],
      },
      'color',
      'bgColor',
      '|',
      'fontSize',
      'fontFamily',
      'lineHeight',
      '|',
      'bulletedList',
      'numberedList',
      'todo',
      {
        key: 'group-justify',
        title: '对齐',
        iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
        menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify'],
      },
      {
        key: 'group-indent',
        title: '缩进',
        iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
        menuKeys: ['indent', 'delIndent'],
      },
      '|',
      'emotion',
      'insertLink',
      'insertTable',
      'codeBlock',
      'divider',
      '|',
      'undo',
      'redo',
      '|',
      'fullScreen',
    ]
  }, [editor])
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
