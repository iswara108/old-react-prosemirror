import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { collect, updateCurrentlyCollecting } from '../../redux/actions'
import ProseHashtagView from '../hooks/proseMirrorRichTextEditor/ProseHashtagView'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  button: {
    margin: theme.spacing(1)
  },
  textField: {
    display: 'block',
    margin: theme.spacing(1),
    width: '300px'
  }
}))

const Collect = props => {
  const classes = useStyles()
  const { proseTitle, proseDescription } = props
  const onCollectClick = () => {
    props.collect(proseTitle, proseDescription)
    props.updateCurrentlyCollecting(null, null)
    //TODO: Focus back on title.
  }

  useEffect(() => {
    props.updateCurrentlyCollecting(proseTitle, proseDescription)
  }, [proseTitle, proseDescription])

  return (
    <>
      <h1>Collect Page</h1>
      <form className={classes.container}>
        <Paper>
          <ProseHashtagView
            id='title'
            label='title'
            validHashtags={props.validHashtags}
            includeMarks={false}
            multiline={false}
            content={proseTitle}
            onChange={doc =>
              props.updateCurrentlyCollecting(doc, proseDescription)
            }
            autoFocus
          />
          <ProseHashtagView
            id='description'
            label='description'
            validHashtags={props.validHashtags}
            content={proseDescription}
            onChange={doc => props.updateCurrentlyCollecting(proseTitle, doc)}
          />

          <Button
            onClick={onCollectClick}
            className={classes.button}
            color='primary'
            variant='contained'
          >
            Collect
          </Button>
        </Paper>
      </form>
    </>
  )
}

export default connect(
  state => ({
    validHashtags: state.validHashtags,
    proseTitle: state.items.currentlyCollecting.proseTitle,
    proseDescription: state.items.currentlyCollecting.proseDescription
  }),
  dispatch => ({
    collect: (proseTitle, proseDescription) =>
      dispatch(collect({ proseTitle, proseDescription })),
    updateCurrentlyCollecting: (proseTitle, proseDescription) =>
      dispatch(updateCurrentlyCollecting({ proseTitle, proseDescription }))
  })
)(Collect)
