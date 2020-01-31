import React /* eslint-disable-line no-unused-vars */, {
  useState,
  useLayoutEffect,
  useEffect
} from 'react'
import { Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

function useDefaultProseState({
  onChange,
  initialContent,
  multiline,
  disableMarks,
  schema = defaultSchema(multiline, disableMarks),
  disableEdit,
  plugins: additionalPlugins = []
}) {
  const [editorState, setEditorState] = useState()
  if (disableEdit) {
    additionalPlugins.unshift(
      new Plugin({
        key: new PluginKey('Read Only Plugin'),
        filterTransaction: transaction => !transaction.docChanged
      })
    )
  }

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

  useEffect(() => {
    setEditorState(
      EditorState.create({
        doc: initialContent
          ? schema.nodeFromJSON(initialContent)
          : schema.node('doc', null, schema.node('paragraph', null)),
        plugins
      })
    )
  }, [setEditorState])

  useLayoutEffect(() => {
    if (editorState && onChange) onChange(editorState)
  }, [editorState, onChange])

  return [editorState, setEditorState]
}

function defaultSchema(multiline, disableMarks) {
  return new Schema({
    nodes: schemaBasic.spec.nodes.update(
      'doc',
      multiline ? schemaBasic.spec.nodes.get('doc') : { content: 'block' }
    ),
    marks: disableMarks ? undefined : schemaBasic.spec.marks
  })
}

export default useDefaultProseState
