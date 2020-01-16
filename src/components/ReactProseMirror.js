import React from 'react'

import ProseHashtagView from './ProseHashtagView'
import ProseDefaultView from './ProseDefaultView'

export default props => {
  if (props.hashtags) return <ProseHashtagView {...props} />
  else return <ProseDefaultView {...props} />
}
