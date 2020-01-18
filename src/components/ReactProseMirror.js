import React from 'react'

import ProseHashtagView from './ProseHashtagView'
import ProseDefaultView from './ProseDefaultView'

export default props => {
  const { hashtags, hashtagSuggestionList = [] } = props

  if (!hashtags) {
    return <ProseDefaultView {...props} />
  } else {
    return (
      <ProseHashtagView
        {...props}
        hashtagSuggestionList={hashtagSuggestionList}
      />
    )
  }
}
