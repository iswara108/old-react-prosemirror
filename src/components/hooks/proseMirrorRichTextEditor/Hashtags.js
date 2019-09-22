import React from 'react'
import { connect } from 'react-redux'
import SelectHashtags from './SelectHashtags'

const Hashtags = props => {
  return <SelectHashtags {...props} suggestions={props.validHashtags} />
}

const mapStateToProps = state => ({ validHashtags: state.validHashtags })

export default connect(mapStateToProps)(Hashtags)
