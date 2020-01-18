import React from 'react'

import ProseHashtagView from './ProseHashtagView'
import ProseDefaultView from './ProseDefaultView'

export default props => {
  const { hashtags, hashtagSuggestionList = [] } = props

  if (hashtags) {
    return (
      <ProseHashtagView
        {...props}
        hashtagSuggestionList={hashtagSuggestionList}
      />
    )
  } else {
    return <ProseDefaultView {...props} />
  }
}
