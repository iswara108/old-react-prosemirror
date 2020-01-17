import React from 'react'

import ProseHashtagView from './ProseHashtagView'
import ProseDefaultView from './ProseDefaultView'

export default props => {
  if (!props.hashtags) {
    return <ProseDefaultView {...props} />
  } else if (Array.isArray(props.hashtags)) {
    return (
      <ProseHashtagView
        {...props}
        hashtags={undefined}
        hashtagSuggestionList={props.hashtags}
      />
    )
  } else {
    return <ProseHashtagView {...props} />
  }
}
