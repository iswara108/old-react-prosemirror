import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Suggestion from './Sugestion'

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

export default ({
  inputValue,
  suggestions,
  highlightIndex,
  setHighlightIndex,
  setAsSelected
}) => {
  const classes = useStyles()
  const selectedItem = undefined

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div>
          <Paper className={classes.paper} square>
            {!suggestions.some(suggestion => suggestion === inputValue) && (
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
            {suggestions.map((suggestion, index) => (
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
