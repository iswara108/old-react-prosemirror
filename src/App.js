import React, { useState, useEffect } from 'react'
import applyDevTools from 'prosemirror-dev-tools'

import ReactProseMirror from './components/ReactProseMirror'
import { HASHTAG_SCHEMA_NODE_TYPE } from './components/tagging/model/taggingUtils'

function App() {
  const [hashtagListFixture, setHashtagListFixture] = useState()
  const [hashtagListDynamic, setHashtagListDynamic] = useState([])
  const [devtools, setDevtools] = useState(false)
  const [editorView, setEditorView] = useState()
  const ref = React.createRef()
  const [hashtagContent, setHashtagContent] = useState({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'here is a ' },
          {
            type: HASHTAG_SCHEMA_NODE_TYPE,
            content: [{ type: 'text', text: '#hashtag' }]
          },
          { type: 'text', text: ' ' }
        ]
      }
    ]
  })
  const [content, setContent] = useState({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'hello, '
          },
          {
            type: 'text',
            marks: [
              {
                type: 'strong'
              }
            ],
            text: 'world'
          }
        ]
      }
    ]
  })

  useEffect(() => {
    setHashtagListFixture(window.hashtagListFixture)
  }, [])

  useEffect(() => {
    console.info(JSON.stringify(content, undefined, 2))
    console.info(ref && ref.current && ref.current.innerHTML)
  }, [content, ref])

  useEffect(() => {
    if (content && editorView && !devtools) {
      applyDevTools(editorView)
      setDevtools(true)
    }
  }, [content, editorView, devtools])

  useEffect(() => {
    console.info('hashtagContent')
    console.info(JSON.stringify(hashtagContent))
  }, [hashtagContent])

  return (
    <>
      <ReactProseMirror
        id="prosemirror-multiline"
        label="description"
        multiline
      />
      <ReactProseMirror
        id="prosemirror-multiline2"
        label="description"
        multiline
      />
      <ReactProseMirror
        id="prosemirror-multiline-controlled"
        label="description"
        multiline
        value={content}
        onChange={c => setContent(c)}
        autoFocus
      />
      <ReactProseMirror
        id="prosemirror-multiline2-controlled"
        label="description"
        multiline
        value={content}
        onChange={c => setContent(c)}
        ref={ref}
      />
      <ReactProseMirror id="prosemirror-singleline" label="description" />
      {hashtagListFixture && (
        <ReactProseMirror
          id="prosemirror-hashtag-immutables"
          label="Hastag Prosemirror"
          hashtagSuggestions={hashtagListFixture}
          tags="immutable"
          multiline
          onNewHashtag={hashtag =>
            setHashtagListFixture([...hashtagListFixture, hashtag])
          }
        />
      )}
      <ReactProseMirror
        id="prosemirror-hashtag-mutables-controlled"
        label="Hastag Prosemirror Controlled"
        hashtagSuggestions={hashtagListDynamic}
        tags="mutable"
        multiline
        onNewHashtag={hashtag =>
          setHashtagListDynamic([...hashtagListDynamic, hashtag])
        }
        setEditorView={setEditorView}
        value={hashtagContent}
        onChange={c => setHashtagContent(c)}
      />
      <ReactProseMirror
        id="prosemirror-hashtag-mutables"
        label="Hastag Prosemirror"
        hashtagSuggestions={hashtagListDynamic}
        tags="mutable"
        multiline
        onNewHashtag={hashtag =>
          setHashtagListDynamic([...hashtagListDynamic, hashtag])
        }
      />
    </>
  )
}

export default App
