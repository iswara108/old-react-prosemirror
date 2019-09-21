import React from 'react'
import PropTypes from 'prop-types'
import deburr from 'lodash/deburr'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

function Suggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem
}) {
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion) > -1

  return (
    <MenuItem
      {...itemProps}
      key={suggestion}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
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

function getSuggestions(value, suggestions = [], { showEmpty = false } = {}) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  let count = 0
  console.log('getting suggestions out of,', suggestions, 'for  ', inputValue)
  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter(suggestion => {
        // debugger
        const keep =
          count < 5 &&
          suggestion.slice(0, inputLength).toLowerCase() === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  }
}))

export default ({ inputValue, suggestions, highlightedIndex }) => {
  const classes = useStyles()
  const selectedItem = undefined
  const [myPreciousValue, setVal] = React.useState('')
 

  return (
    <>
      <TextField InputProps={{ value: myPreciousValue }} />
      <div className={classes.root}>
        <div className={classes.container}>
          <div>
            <Paper className={classes.paper} square>
              {getSuggestions(inputValue, suggestions).map(
                (suggestion, index) => (
                  <Suggestion
                    suggestion={suggestion}
                    index={index}
                    key={suggestion}
                    itemProps={{}}
                    highlightedIndex={highlightedIndex}
                    selectedItem={selectedItem || ''}
                  />
                )
              )}
            </Paper>
          </div>
        </div>
      </div>
    </>
  )
}
