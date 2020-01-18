import React, { useState, useEffect } from 'react'

import ReactProseMirror from './components/ReactProseMirror'

function App() {
  const [hashtagListFixture, setHashtagListFixture] = useState()
  const [hashtagListDynamic, setHashtagListDynamic] = useState([])

  useEffect(() => {
    setHashtagListFixture(window.hashtagListFixture)
  }, [])
  return (
    <>
      <ReactProseMirror
        id="prosemirror-multiline"
        label="description"
        content={undefined}
        onChange={doc => console.info(doc.toString())}
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
