import * as actionTypes from '../actions/actionTypes'
import uuid from 'uuid/v1'

export default (state = { inbox: [], nextActions: [] }, action) => {
	switch (action.type) {
		case actionTypes.COLLECT: {
			const newState = { ...state }

			newState.inbox.push({ ...action.payload, id: uuid() })
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
