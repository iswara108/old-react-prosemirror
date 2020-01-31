import React, { useState, useEffect } from 'react'
import applyDevTools from 'prosemirror-dev-tools'

import ReactProseMirror from './components/ReactProseMirror'

function App() {
  const [hashtagListFixture, setHashtagListFixture] = useState()
  const [hashtagListDynamic, setHashtagListDynamic] = useState([])
  const [devtools, setDevtools] = useState(false)
  const [editorView, setEditorView] = useState()

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
  }, [content])

  useEffect(() => {
    if (content && editorView && !devtools) {
      applyDevTools(editorView)
      setDevtools(true)
    }
  }, [content, editorView, devtools])

  return (
    <>
      <ReactProseMirror
        id="prosemirror-multiline"
        label="description"
        multiline
      />
      <ReactProseMirror id="prosemirror-singleline" label="description" />
      {hashtagListFixture && (
        <ReactProseMirror
          id="prosemirror-hashtag-immutables"
          label="Hastag Prosemirror"
          hashtagSuggestionList={hashtagListFixture}
          hashtags="immutable"
          multiline
          onNewHashtag={hashtag =>
            setHashtagListFixture([...hashtagListFixture, hashtag])
          }
        />
      )}
      <ReactProseMirror
        id="prosemirror-hashtag-mutables"
        label="Hastag Prosemirror"
        hashtagSuggestionList={hashtagListDynamic}
        hashtags="mutable"
        multiline
        onNewHashtag={hashtag =>
          setHashtagListDynamic([...hashtagListDynamic, hashtag])
        }
      />
    </>
  )
}

export default App
