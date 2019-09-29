import { useState, useEffect, useRef } from 'react'
import { EditorState, Plugin } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { EditorView } from 'prosemirror-view'
import { schema as schemaBasic } from 'prosemirror-schema-basic'

function useProseState(schema = schemaBasic, additionalPlugins = []) {
  const [editorState, setEditorState] = useState()

  useEffect(() => {
    const syncStatePlugin = new Plugin({
      view: () => ({
        update: view => setEditorState(view.state)
      })
    })

    setEditorState(
      EditorState.create({
        doc: schema.node('doc', null, schema.node('paragraph', null)),
        plugins: [
          ...exampleSetup({ schema, menuBar: false }),
          syncStatePlugin,
          ...additionalPlugins
        ]
      })
    )
  }, [schema, additionalPlugins])

  return editorState
}

function useProseView(editorState) {
  const dom = useRef(document.createElement('div'))
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

  return dom
}

export { useProseState, useProseView }
