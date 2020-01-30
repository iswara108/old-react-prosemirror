import React /* eslint-disable-line no-unused-vars */, {
  useState,
  useLayoutEffect
} from 'react'
import { Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { EditorState, Plugin, PluginKey, Selection } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

function useDefaultProseState({
  onChange,
  content,
  multiline,
  disableMarks,
  schema = defaultSchema(multiline, disableMarks),
  disableEdit,
  plugins: additionalPlugins = []
}) {
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

  // Called whenever changed from the parent
  useLayoutEffect(() => {
    if (
      editorState &&
      content &&
      editorState.doc.eq(content.doc) &&
      editorState.selection.eq(content.selection)
    )
      return

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

  const [editorState, setEditorState] = useState()

  useLayoutEffect(() => {
    if (!editorState) return

    if (onChange) onChange(editorState.toJSON())
  }, [editorState])

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
