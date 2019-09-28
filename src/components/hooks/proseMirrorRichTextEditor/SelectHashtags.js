import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
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
  suggestions,
  highlightedIndex,
  setHighlightIndex,
  setAsSelected
}) => {
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
              {suggestions.map((suggestion, index) => (
                <Suggestion
                  suggestion={suggestion}
                  index={index}
                  key={suggestion}
                  itemProps={{}}
                  highlightedIndex={highlightedIndex}
                  selectedItem={selectedItem || ''}
                  setHighlightIndex={setHighlightIndex}
                  setAsSelected={setAsSelected}
                />
              ))}
            </Paper>
          </div>
        </div>
      </div>
    </>
  )
}
