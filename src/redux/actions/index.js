import * as actionTypes from './actionTypes'

// payload expected to have {proseTitle, proseDescription}
const collect = payload => ({
  type: actionTypes.COLLECT,
  payload
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

// payload expected to have {proseTitle, proseDescription}
const updateCurrentlyCollecting = payload => ({
  type: actionTypes.UPDATE_CURRENTLY_COLLECTION,
  payload
})

export { collect, clarifyToNextAction, addHashtag, updateCurrentlyCollecting }
