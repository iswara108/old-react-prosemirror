import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Suggestion from './Suggestion'
import { SuggestionType } from '../state/suggestionsRecuder'

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

type Props = {
  inputValue: string
  suggestionList: SuggestionType[]
  highlightIndex: number
  setHighlightIndex: (index: number) => void
  setAsSelected: (index: number) => void
  readOnly: boolean
}
const SuggestionDropdown: React.FC<Props> = ({
  inputValue,
  suggestionList,
  highlightIndex,
  setHighlightIndex,
  setAsSelected,
  readOnly = false
}): JSX.Element => {
  const classes = useStyles()
  const selectedItem = undefined

  return (
    <div className={classes.root + ' suggestions-dropdown'}>
      <div className={classes.container}>
        <div>
          <Paper className={classes.paper} square>
            {
              // display option to create new hashtag only if there is no exact match.
              !readOnly &&
                !suggestionList.some(
                  suggestion => suggestion.tagName === inputValue
                ) && (
                  <Suggestion
                    suggestion={{ tagName: `${inputValue} (create new)` }}
                    index={-1}
                    key={inputValue}
                    itemProps={{}}
                    highlightIndex={highlightIndex}
                    selectedItem={selectedItem || ''}
                    setHighlightIndex={setHighlightIndex}
                    setAsSelected={setAsSelected}
                  />
                )
            }
            {suggestionList.map((suggestion, index) => (
              <Suggestion
                suggestion={suggestion}
                index={index}
                key={suggestion.tagName}
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

export default SuggestionDropdown
