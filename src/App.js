import React from 'react'

import ReactProseMirror from './components/ReactProseMirror'

function App() {
  return (
    <>
      <ReactProseMirror
        id="prosemirror"
        label="description"
        content={undefined}
        onChange={doc => console.info(doc.toString())}
      />
      <ReactProseMirror
        id="prosemirror-hashtag"
        label="Hastag Prosemirror"
        hashtags
      />
    </>
  )
}

export default App
