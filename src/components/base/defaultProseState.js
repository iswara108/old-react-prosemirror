import { useLayoutEffect, useEffect, useReducer } from 'react'
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
// 4. Allows for initialContent in the form of a JSON object (see https://prosemirror.net/docs/ref/#model.Node.toJSON)
//
// Returns:
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
          doc:
            defaultValue || value
              ? schema.nodeFromJSON(defaultValue || value)
              : schema.node('doc', null, schema.node('paragraph', null)),
          plugins
        })

      case 'setNewState':
        const newState = EditorState.fromJSON(
          { schema, plugins },
          action.payload.toJSON()
        )

        return newState
      case 'setNewContent': {
        if (
          state &&
          action.payload &&
          JSON.stringify(state.doc) !== JSON.stringify(action.payload)
        ) {
          return EditorState.create(
            { doc: Node.fromJSON(schema, action.payload), plugins },
            action.payload
          )
        } else {
          return state
        }
      }
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
    if (editorState && onChange) {
      onChange(editorState.doc.toJSON())
    }
  }, [editorState])

  // update inner state whenever parent state changed
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
