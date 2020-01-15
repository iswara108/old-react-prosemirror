import { useState, useLayoutEffect, useRef } from 'react'
import { EditorState, Plugin, Selection } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { EditorView } from 'prosemirror-view'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import './richTextEditor.css'

function useProseState(
  schema = schemaBasic,
  additionalPlugins = [],
  content
) {
  const contentNode =
    (content && schema.nodeFromJSON(content)) ||
    schema.node('doc', null, schema.node('paragraph', null))

  const [editorState, setEditorState] = useState()

  // Called whenever changed from the parent
  useLayoutEffect(() => {
    if (editorState && editorState.doc.toString() === contentNode.toString())
      return

    const syncStatePlugin = new Plugin({
      view: () => ({
        update: view => setEditorState(view.state)
      })
    })

    setEditorState(
      EditorState.create({
        doc: contentNode,
        selection: Selection.atEnd(contentNode),
        plugins: [
          ...exampleSetup({ schema, menuBar: false }),
          syncStatePlugin,
          ...additionalPlugins
        ]
      })
    )
  }, [contentNode && contentNode.toString()])
  return editorState
}

function useProseView({ editorState, autoFocus }) {
  const dom = useRef(document.createElement('div'))

  const [view, setView] = useState(null)

  useLayoutEffect(() => {
    if (editorState && !view) {
      setView(
        new EditorView(dom.current, {
          state: editorState
        })
      )
    }
  }, [editorState, view])

  useLayoutEffect(() => {
    if (view && editorState) {
      if (view.state !== editorState) {
        view.updateState(editorState)
      }
    }
  }, [editorState])

  useLayoutEffect(() => {
    if (view && autoFocus) view.focus()
  }, [view])

  return dom
}

export { useProseState, useProseView }
