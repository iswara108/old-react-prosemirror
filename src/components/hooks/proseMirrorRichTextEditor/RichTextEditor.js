import React, { useEffect, useRef, useState } from "react"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { keymap } from "prosemirror-keymap"
import { undo, redo, history } from "prosemirror-history"
import { schema } from "prosemirror-schema-basic"
import hashtagPlugin from "./hashtagPlugin"
import "prosemirror-view/style/prosemirror.css"
import "./richTextEditor.css"

const RichTextEditor = ({ autoFocus }) => {
  const [view, setView] = useState(null)
  const editorRef = useRef()

  useEffect(() => {
    setView(
      new EditorView(null, {
        state: EditorState.create({
          schema,
          plugins: [
            keymap({ "Mod-z": undo, "Mod-y": redo }),
            history(),
            hashtagPlugin
          ]
        })
      })
    )
  }, [])

  useEffect(() => {
    if (view) {
      editorRef.current.appendChild(view.dom)
      if (autoFocus) {
        view.focus()
      }
    }
  }, [view, autoFocus])

  return <div ref={editorRef} />
}

export default RichTextEditor
