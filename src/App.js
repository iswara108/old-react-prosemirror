import React, { useState, useEffect } from 'react'

import ReactProseMirror from './components/ReactProseMirror'

function App() {
  const [hashtagListFixture, setHashtagListFixture] = useState()

  useEffect(() => {
    setHashtagListFixture(window.hashtagListFixture)
  }, [])
  return (
    <>
      <ReactProseMirror
        id="prosemirror"
        label="description"
        content={undefined}
        onChange={doc => console.info(doc.toString())}
        multiline
      />
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
        hashtagSuggestionList={hashtagListFixture}
        hashtags="mutable"
        multiline
      />
    </>
  )
}

export default App
