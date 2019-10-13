import uuid from 'uuid/v1'
import { Node } from 'prosemirror-model'
import * as actionTypes from '../actions/actionTypes'
import { hashtagSchema } from '../../components/hooks/proseMirrorRichTextEditor/hashtagHook'

const extractHashtags = proseDoc => {
  const nodeCollected = hashtagSchema().nodeFromJSON(proseDoc)
  const hashtags = []
  nodeCollected.descendants((node, pos, parent) => {
    if (parent.type.name === 'hashtag') {
      hashtags.push(node.text)
    }
  })

  return Array.from(new Set(hashtags))
}
export default (state = { inbox: [], nextActions: [] }, action) => {
  switch (action.type) {
    case actionTypes.COLLECT: {
      const newState = { ...state }
      const hashtags = extractHashtags(action.payload.proseTitle)

      newState.inbox.push({
        ...action.payload,
        hashtags,
        id: uuid()
      })
      return newState
    }
    case actionTypes.CLARIFY_TO_NEXT_ACTION: {
      const newState = { ...state }

      newState.inbox = state.inbox.filter(item => item.id !== action.payload.id)
      newState.nextActions = state.nextActions.slice()
      newState.nextActions.push(action.payload)

      return newState
    }
    default: {
      return state
    }
  }
}
