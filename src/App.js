import React from 'react'

import ProseDefaultView from './components/ProseDefaultView'

function App() {

  return (
    <ProseDefaultView
      id='prosemirror'
      label='description'
      content={undefined}
      onChange={doc => console.info(doc.toString())}
    />
  )
}

export default App
