import React from 'react'
import { connect } from 'react-redux'
import SelectHashtags from './SelectHashtags'

const Hashtags = ({ currentlyEditing, validHashtags }) => {
  return (
    <>
      <SelectHashtags
        inputValue={currentlyEditing}
        suggestions={validHashtags} shouldBeOpen={true}
      />
      <ul>
        {validHashtags.map(validHashtag => (
          <li key={validHashtag}>{validHashtag}</li>
        ))}
        <li>{currentlyEditing}</li>
      </ul>
    </>
  )
}

const mapStateToProps = state => ({ validHashtags: state.validHashtags })

export default connect(mapStateToProps)(Hashtags)
