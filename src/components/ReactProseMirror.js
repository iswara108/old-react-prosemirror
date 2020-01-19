import React from 'react'
import PropTypes from 'prop-types'

import ProseHashtagView from './ProseHashtagView'
import ProseDefaultView from './ProseDefaultView'

const ReactProseMirror = props => {
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

ReactProseMirror.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  hashtags: PropTypes.oneOf(['mutable', 'immutable']),
  hashtagSuggestionList: PropTypes.array,
  multiline: PropTypes.bool
}

export default ReactProseMirror
