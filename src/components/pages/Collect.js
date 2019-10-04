import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { collect } from '../../redux/actions'
import ProseHashtagView from '../hooks/proseMirrorRichTextEditor/ProseHashtagView'
import './richTextEditor.css'

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

  const onCollectClick = () => {
    if (!(title && description)) return
    props.collect({ title, description })
    setTitle('')
    setDescription('')
    //TODO: Focus back on title.
  }

  return (
    <>
      <h1>Collect Page</h1>
      <form className={classes.container}>
        <Paper>
          <ProseHashtagView
            validHashtags={props.validHashtags}
            multiline={false}
          />
          {/* <RichTextEditor
            id="rte-title"
            label="Title"
            required
            autoFocus
            onChange={({ target: { value } }) => setRteTitle(value)}
          /> */}
          <TextField
            id="title"
            value={title}
            className={classes.textField}
            label="Title"
            variant="filled"
            required
            onChange={({ target: { value } }) => setTitle(value)}
          />
          <TextField
            id="description"
            value={description}
            className={classes.textField}
            label="Description"
            variant="filled"
            required
            // multiline
            onChange={({ target: { value } }) => setDescription(value)}
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
