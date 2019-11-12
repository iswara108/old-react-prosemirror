import React from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import ProseHashtagView from '../hooks/proseMirrorRichTextEditor/ProseHashtagView'

const Lists = props => (
  <>
    <h1>Inbox list:</h1>
    <ul>
      {props.items.inbox.map((item, index) => (
        <li key={item.id}>
          <ProseHashtagView
            multiline={false}
            content={item.proseTitle}
            label={'title'}
            disableEdit
          />
          <ProseHashtagView
            multiline={true}
            content={item.proseDescription}
            label={'description'}
            disableEdit
          />
        </li>
      ))}
    </ul>
    <h1>Next Actions:</h1>
    <ul>
      {props.items.nextActions.map((item, index) => (
        <li key={item.id}>
          {JSON.stringify(item.proseTitle)}
          <Typography variant="body1">
            {JSON.stringify(item.proseDescription)}
          </Typography>
        </li>
      ))}
    </ul>
  </>
)

export default connect(state => ({ items: state.items }))(Lists)
