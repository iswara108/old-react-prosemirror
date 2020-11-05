import { useDebouncedCallback } from 'use-debounce'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import Token from '../../../utils/text/token'

type Props = {
  suggestion:
    | string
    | { avatarUrl?: string; displayName?: string; tagName: string }
  index: number
  itemProps: any
  highlightIndex: number
  selectedItem: string
  setHighlightIndex: (index: number) => void
  setAsSelected: (index: number) => void
}

const Suggestion: React.FC<Props> = ({
  suggestion,
  index,
  itemProps,
  highlightIndex,
  selectedItem,
  setHighlightIndex,
  setAsSelected
}): JSX.Element => {
  const isHighlighted = highlightIndex === index

  const isSelected =
    typeof suggestion === 'string'
      ? (selectedItem || '').indexOf(suggestion) > -1
      : false

  const setToMyIndex = useDebouncedCallback<(index: number) => void>(
    () => setHighlightIndex(index),
    5
  )

  return (
    <MenuItem
      {...itemProps}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
      onMouseMove={() => {
        if (!isHighlighted) setToMyIndex.callback(index)
      }}
      onClick={() => setAsSelected(index)}
    >
      {typeof suggestion === 'object' && suggestion.displayName ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <img
            style={{ width: '50px', marginRight: '10px' }}
            src={suggestion.avatarUrl}
            alt={suggestion.displayName}
          />
          <p>{suggestion.displayName}</p>
        </div>
      ) : (
        <>{typeof suggestion === 'object' && suggestion.tagName}</>
      )}
    </MenuItem>
  )
}

export default Suggestion
