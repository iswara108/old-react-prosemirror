import { useDebouncedCallback } from 'use-debounce'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'

function Suggestion({
  suggestion,
  index,
  itemProps,
  highlightIndex,
  selectedItem,
  setHighlightIndex,
  setAsSelected
}) {
  const isHighlighted = highlightIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion) > -1

  const setToMyIndex = useDebouncedCallback(() => setHighlightIndex(index), 5)

  return (
    <MenuItem
      {...itemProps}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
      onMouseMove={() => {
        if (!isHighlighted) setToMyIndex()
      }}
      onClick={() => setAsSelected(index)}
    >
      {suggestion.displayName ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <img
            style={{ width: '50px', marginRight: '10px' }}
            src={suggestion.avatarURL}
            alt={suggestion.displayName}
          />
          <p>{suggestion.displayName}</p>
        </div>
      ) : (
        suggestion.tagName
      )}
    </MenuItem>
  )
}

Suggestion.propTypes = {
  highlightIndex: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.number
  ]).isRequired,
  index: PropTypes.number.isRequired,
  itemProps: PropTypes.object.isRequired,
  selectedItem: PropTypes.string.isRequired,
  suggestion: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}

export default Suggestion
