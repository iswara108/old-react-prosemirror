import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Suggestion from './Suggestion'

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

const SelectSuggestion = ({
  inputValue,
  suggestionList,
  highlightIndex,
  setHighlightIndex,
  setAsSelected
}) => {
  const classes = useStyles()
  const selectedItem = undefined

  return (
    <div className={classes.root + ' select-suggestions'}>
      <div className={classes.container}>
        <div>
          <Paper className={classes.paper} square>
            {// display option to create new hashtag only if there is no exact match.
            !suggestionList.some(suggestion => suggestion === inputValue) && (
              <Suggestion
                suggestion={`${inputValue} (create new)`}
                index={-1}
                key={inputValue}
                itemProps={{}}
                highlightIndex={highlightIndex}
                selectedItem={selectedItem || ''}
                setHighlightIndex={setHighlightIndex}
                setAsSelected={setAsSelected}
              />
            )}
            {suggestionList.map((suggestion, index) => (
              <Suggestion
                suggestion={suggestion}
                index={index}
                key={suggestion}
                itemProps={{}}
                highlightIndex={highlightIndex}
                selectedItem={selectedItem || ''}
                setHighlightIndex={setHighlightIndex}
                setAsSelected={setAsSelected}
              />
            ))}
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default SelectSuggestion
