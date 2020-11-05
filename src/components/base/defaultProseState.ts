import * as React from 'react'
import { Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { Node } from 'prosemirror-model'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

// this hook manages the prosemirror editorState controlled by its parent. (https://prosemirror.net/docs/ref/#state)
// It:
// 1. Keeps the editorView (https://prosemirror.net/docs/ref/#view) in sync with the state
// 2. Initializes any plugin (https://prosemirror.net/docs/ref/#state.Plugin_System) passed through props
// 3. Introduces a "read only plugin", if "disableEdit" prop is passed
// 4. Allows for defaultValue prop in the form of a JSON object for an uncontrolled component (see https://prosemirror.net/docs/ref/#model.Node.toJSON)
// 5. Allows for value and onChange props in the from of a JSON object for a controlled component
//
// Returns: editorState (see https://prosemirror.net/docs/ref/#state.Editor_State), setEditorState (callback to dispatch a change in the editorState)

function useDefaultProseState({
  value,
  onChange,
  defaultValue,
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
      update: view => {
        if (JSON.stringify(view.state) !== JSON.stringify(editorState)) {
          setEditorState(view.state)
        }
      }
    })
  })

  const plugins = [
    ...exampleSetup({ schema, menuBar: false }),
    syncStatePlugin,
    ...additionalPlugins
  ]

  function editorStateReducer(state: EditorState, action: ACTIONTYPE) {
    switch (action.type) {
      case 'initState':
        return EditorState.create({
          doc:
            defaultValue || value
              ? schema.nodeFromJSON(defaultValue || value)
              : schema.node('doc', null, schema.node('paragraph', null)),
          plugins
        })

      case 'setNewState':
        return EditorState.fromJSON(
          { schema, plugins },
          action.payload.toJSON()
        )

      case 'setNewContent': {
        return state &&
          action.payload &&
          JSON.stringify(state.doc) !== JSON.stringify(action.payload) // compare contents. Only if changed - create a new state.
          ? EditorState.create(
              { doc: Node.fromJSON(schema, action.payload), plugins },
              action.payload
            )
          : state
      }

      default:
        throw new Error(`action type ${action.type} isn't recognized.`)
    }
  }

  type ACTIONTYPE =
    | { type: 'initState' }
    | { type: 'setNewState'; payload: EditorState }
    | { type: 'setNewContent'; payload: Node }
  const [editorState, dispatch] = useReducer(editorStateReducer)

  // initialize editorState once the component is mounted.
  useEffect(() => {
    dispatch({ type: 'initState' })
  }, [])

  const setEditorState = newState =>
    dispatch({ type: 'setNewState', payload: newState })

  // in order to avoid infinite rerenders due to onChange callbacks - save as ref. (See https://github.com/facebook/react/issues/15282)
  const latestOnChange = useRef(onChange)
  useLayoutEffect(() => (latestOnChange.current = onChange), [onChange])

  // update parent component whenever editorState changes.
  useLayoutEffect(() => {
    if (editorState && latestOnChange.current) {
      latestOnChange.current(editorState.doc.toJSON())
    }
  }, [editorState, latestOnChange])

  // update inner state whenever parent changed values.
  useLayoutEffect(() => {
    dispatch({ type: 'setNewContent', payload: value })
  }, [value])

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
