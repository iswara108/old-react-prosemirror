import * as actionTypes from './actionTypes'

const collect = ({ title, description }) => ({
	type: actionTypes.COLLECT,
	payload: { title, description }
})

const clarifyToNextAction = ({ id, title, description }) => ({
	type: actionTypes.CLARIFY_TO_NEXT_ACTION,
	payload: { title, description, id }
})

export { collect, clarifyToNextAction }
