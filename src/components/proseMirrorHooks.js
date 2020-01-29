import { useState, useLayoutEffect, useRef } from 'react'
import { EditorState, Plugin, PluginKey, Selection } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { EditorView } from 'prosemirror-view'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import './richTextEditor.css'

function useProseState(schema = schemaBasic, additionalPlugins = [], content) {
  const [editorState, setEditorState] = useState()

  const syncStatePlugin = new Plugin({
    key: new PluginKey('Sync State Plugin'),
    view: () => ({
      update: view => setEditorState(view.state)
    })
  })

  const plugins = [
    ...exampleSetup({ schema, menuBar: false }),
    syncStatePlugin,
    ...additionalPlugins
  ]

  // Called whenever changed from the parent
  useLayoutEffect(() => {
    if (
      editorState &&
      content &&
      editorState.doc.eq(content.doc) &&
      editorState.selection.eq(content.selection)
    )
      return
    // editorState.doc.toString() === contentNode.toString())
    // return

    const contentNode =
      (content && schema.nodeFromJSON(content)) ||
      schema.node('doc', null, schema.node('paragraph', null))

    setEditorState(
      EditorState.create({
        doc: contentNode,
        selection: Selection.atEnd(contentNode),
        plugins
      })
    )
  }, [content, setEditorState])
  return editorState
}

function useProseView({ editorState, autoFocus }) {
  const dom = useRef(document.createElement('div'))

  const [editorView, setEditorView] = useState(null)

  useLayoutEffect(() => {
    if (editorState && !editorView) {
      setEditorView(
        new EditorView(dom.current, {
          state: editorState
        })
      )
    }
  }, [editorState, editorView])

  useLayoutEffect(() => {
    if (editorView && editorState) {
      if (editorView.state !== editorState) {
        editorView.updateState(editorState)
      }
    }
  }, [editorState])

  useLayoutEffect(() => {
    if (editorView && autoFocus) editorView.focus()
  }, [editorView, autoFocus])

  return { dom, editorView }
}

export { useProseState, useProseView }
