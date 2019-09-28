import _ from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

function Suggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
  setHighlightIndex,
  setAsSelected
}) {
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion) > -1

  const [setToMyIndex] = useDebouncedCallback(() => setHighlightIndex(index), 5)
  return (
    <MenuItem
      {...itemProps}
      key={suggestion}
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
      {suggestion}
    </MenuItem>
  )
}

Suggestion.propTypes = {
  highlightedIndex: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.number
  ]).isRequired,
  index: PropTypes.number.isRequired,
  itemProps: PropTypes.object.isRequired,
  selectedItem: PropTypes.string.isRequired,
  suggestion: PropTypes.string.isRequired
}

export default Suggestion
