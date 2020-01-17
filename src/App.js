import React, { useState, useEffect } from 'react'

import ReactProseMirror from './components/ReactProseMirror'

function App() {
  const [
    hashtagImmutableListFixture,
    setHashtagImmutableListFixture
  ] = useState()

  useEffect(() => {
    setHashtagImmutableListFixture(window.hashtagImmutableListFixture)
  }, [])
  return (
    <>
      <ReactProseMirror
        id="prosemirror"
        label="description"
        content={undefined}
        onChange={doc => console.info(doc.toString())}
      />
      {hashtagImmutableListFixture && (
        <ReactProseMirror
          id="prosemirror-hashtag-immutables"
          label="Hastag Prosemirror"
          hashtags={hashtagImmutableListFixture}
          multiline={false}
        />
      )}
      <ReactProseMirror
        id="prosemirror-hashtag-all"
        label="Hastag Prosemirror"
        hashtags="all"
      />
    </>
  )
}

export default App
