import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { collect } from '../../redux/actions'
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
  const [title, setTitle] = useState('')
  const [rteTitle, setRteTitle] = useState('')
  const [description, setDescription] = useState('')
  const [proseTitle, setProseTitle] = useState(null)
  const [proseDescription, setProseDescription] = useState({})

  const onCollectClick = () => {
    if (!(title && description)) return
    props.collect({ title, description })
    setTitle('')
    setDescription('')
    //TODO: Focus back on title.
  }

  useEffect(() => {
    console.log(JSON.stringify(proseTitle))
  }, [proseTitle])

  return (
    <>
      <h1>Collect Page</h1>
      <form className={classes.container}>
        <Paper>
          <ProseHashtagView
            id="title"
            label="title"
            validHashtags={props.validHashtags}
            includeMarks={false}
            multiline={false}
            onChange={doc => setProseTitle(doc)}
            autoFocus
          />
          <ProseHashtagView
            id="description"
            label="description"
            validHashtags={props.validHashtags}
            multiline={true}
            onChange={doc => setProseDescription(doc)}
          />

          <Button
            onClick={onCollectClick}
            className={classes.button}
            color="primary"
            variant="contained"
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
    validHashtags: state.validHashtags
  }),
  { collect }
)(Collect)
