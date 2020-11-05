import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef
} from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { EditorState } from 'prosemirror-state'
import './proseMirror.css'
import { SuggestionType } from '../tagging/state/suggestionsRecuder'

type Props = {
  id: string
  defaultValue: string
  value: string
  onChange: () => void
  multiline: boolean
  disableMarks: boolean
  autoFocus: boolean
  disableEdit: boolean
  setEditorView?: (editorView: EditorView) => void
  hashtagSuggestions: SuggestionType[]
  mentionSuggestions: SuggestionType[]
  tags: 'mutable' | 'immutable'
  onNewHashtag: () => void
  editorState?: EditorState
}

const ProseView = forwardRef<React.RefObject<any>, Props>((props, ref) => {
  const { editorState, autoFocus } = props
  const [editorView, setEditorView] = useState<EditorView>()

  const contentEditableDom = useRef<HTMLDivElement>(
    document.createElement('div')
  )
  if (ref) (ref as any).current = contentEditableDom.current // forward optional parent ref to DOM element.

  // Initialize editor view on the first time the state exists.
  useLayoutEffect(() => {
    if (editorState && !editorView) {
      setEditorView(
        new EditorView(contentEditableDom.current, {
          state: editorState
        })
      )
    }
  }, [editorState, editorView])

  // export editorView to parent once it is initialized.
  useEffect(() => {
    if (props.setEditorView && editorView) props.setEditorView(editorView)
  }, [props, editorView, props.setEditorView])

  // Update view whenever the state changes
  useLayoutEffect(() => {
    if (
      editorView &&
      editorState &&
      JSON.stringify(editorView.state) !== JSON.stringify(editorState)
    ) {
      editorView.updateState(editorState)
    }
  }, [editorState, editorView])

  // if autoFocus applies - focus upon the creation of the view.
  useLayoutEffect(() => {
    if (editorView && autoFocus) editorView.focus()
  }, [editorView, autoFocus])

  // remove non-HTML props.
  const propsToDiv = { ...props }
  delete propsToDiv?.editorState
  delete propsToDiv?.setEditorView

  return <div ref={contentEditableDom} {...propsToDiv} />
})

export default ProseView
