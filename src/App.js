import React from 'react'

import ProseDefaultView from './components/ProseDefaultView'
import ReactProseMirror from './components/ReactProseMirror'

function App() {
  return (
    <>
      <ProseDefaultView
        id="prosemirror"
        label="description"
        content={undefined}
        onChange={doc => console.info(doc.toString())}
      />
      <ReactProseMirror id="prosemirror-hashtag" label="Hastag Prosemirror" />
    </>
  )
}

export default App
