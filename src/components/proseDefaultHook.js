import React /* eslint-disable-line no-unused-vars */, {
  useLayoutEffect,
  useEffect,
  useReducer
} from 'react'
import { Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

function useDefaultProseState({
  parentControlledState,
  onStateChange,
  initialContent,
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

  const reducer = (state, action) => {
    switch (action.type) {
      case 'initState':
        return EditorState.create({
          doc: initialContent
            ? schema.nodeFromJSON(initialContent)
            : schema.node('doc', null, schema.node('paragraph', null)),
          plugins
        })

      case 'setNewState':
        return EditorState.fromJSON(
          { schema, plugins },
          action.payload.toJSON()
        )
      default:
        throw new Error(`action type ${action.type} isn't recognized.`)
    }
  }

  const [editorState, dispatch] = useReducer(reducer)
  const setEditorState = newState =>
    dispatch({ type: 'setNewState', payload: newState })

  // initialize editorState
  useEffect(() => {
    dispatch({ type: 'initState' })
  }, [])

  // update parent component whenever editorState changes
  useLayoutEffect(() => {
    if (editorState && onStateChange) onStateChange(editorState)
  }, [editorState, onStateChange])

  // update inner state whenever parent state changed
  useLayoutEffect(() => {
    if (parentControlledState)
      dispatch({ type: 'setNewState', payload: parentControlledState })
  }, [parentControlledState])

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
