import * as actionTypes from '../actions/actionTypes'

export default (
  state = [
    '#computer',
    '#office',
    '#commute',
    '#computer2',
    '#office2',
    '#commute2',
    '#computer3',
    '#office3',
    '#commute3'
  ],
  action
) => {
  switch (action.type) {
    default: {
      return state
    }
  }
}
