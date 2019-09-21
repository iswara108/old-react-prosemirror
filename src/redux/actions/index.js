import * as actionTypes from './actionTypes'

const collect = ({ title, description }) => ({
  type: actionTypes.COLLECT,
  payload: { title, description }
})

const clarifyToNextAction = ({ id, title, description }) => ({
  type: actionTypes.CLARIFY_TO_NEXT_ACTION,
  payload: { title, description, id }
})

const addHashtag = hashtag => {
  return {
    type: actionTypes.ADD_HASHTAG,
    payload: { hashtag }
  }
}

export { collect, clarifyToNextAction, addHashtag }