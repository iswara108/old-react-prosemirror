import { combineReducers } from 'redux'
import items from './items'
import validHashtags from './validHashtags'

export default combineReducers({ items, validHashtags })
