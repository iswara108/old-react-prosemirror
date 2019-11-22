import React, {
  useState,
  useEffect
} from 'react' /* eslint-disable-line no-unused-vars */
import { Plugin } from 'prosemirror-state'
import { Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { useProseState } from './proseMirrorHooks'

function useDefaultProseState({
  onChange,
  content,
  multiline,
  includeMarks,
  schema = defaultSchema(multiline, includeMarks),
  disableEdit,
  plugins = []
}) {
  if (disableEdit) {
    plugins.unshift(
      new Plugin({
        filterTransaction: transaction => !transaction.docChanged
      })
    )
  }

  const rawEditorState = useProseState(schema, plugins, content)
  const [editorState, setEditorState] = useState()

  // Whenever the document changed due to user input
  useEffect(() => {
    if (!rawEditorState) return // first time before rawEditorState is initialized
    if (!editorState) return setEditorState(rawEditorState) // first time initialize editorState

    // if either the selection or content changed - update editorState
    if (
      !editorState.doc.eq(rawEditorState.doc) ||
      !editorState.selection.eq(rawEditorState.selection)
    ) {
      setEditorState(rawEditorState)
    }
  }, [rawEditorState])

  useEffect(() => {
    if (!editorState) return

    if (onChange) onChange(editorState.doc.toJSON())
  }, [editorState])

  return [editorState, setEditorState]
}

function defaultSchema(multiline, includeMarks) {
  return new Schema({
    nodes: schemaBasic.spec.nodes.update(
      'doc',
      multiline ? schemaBasic.spec.nodes.get('doc') : { content: 'block' }
    ),
    marks: includeMarks ? schemaBasic.spec.marks : undefined
  })
}

export default useDefaultProseState
