import * as actionTypes from '../actions/actionTypes'

export default (state = ['#computer', '#office', '#commute'], action) => {
  switch (action.type) {
    case actionTypes.ADD_HASHTAG:
      return [...state, action.payload.hashtag]
    default: {
      return state
    }
  }
}
