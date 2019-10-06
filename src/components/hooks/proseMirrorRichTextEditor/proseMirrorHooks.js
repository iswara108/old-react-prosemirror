import { useState, useEffect, useRef } from 'react'
import { EditorState, Plugin } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { EditorView } from 'prosemirror-view'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import './richTextEditor.css'

function useProseState(
  schema = schemaBasic,
  additionalPlugins = [],
  initialDoc
) {
  const [editorState, setEditorState] = useState()

  useEffect(() => {
    const syncStatePlugin = new Plugin({
      view: () => ({
        update: view => setEditorState(view.state)
      })
    })

    setEditorState(
      EditorState.create({
        doc:
          (initialDoc && schema.nodeFromJSON(initialDoc)) ||
          schema.node('doc', null, schema.node('paragraph', null)),
        plugins: [
          ...exampleSetup({ schema, menuBar: false }),
          syncStatePlugin,
          ...additionalPlugins
        ]
      })
    )
  }, [])

  return editorState
}

function useProseView(editorState) {
  const dom = useRef(document.createElement('div'))
  dom.current.style.backgroundColor = 'lightYellow'
  const [view, setView] = useState(null)

  useEffect(() => {
    if (editorState && !view) {
      setView(
        new EditorView(dom.current, {
          state: editorState
        })
      )
    }
  }, [editorState, view])

  useEffect(() => {
    if (view && editorState) {
      if (view.state !== editorState) {
        view.updateState(editorState)
      }
    }
  }, [editorState])

  return dom
}

export { useProseState, useProseView }
