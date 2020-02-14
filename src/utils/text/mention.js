import XRegExp from 'xregexp'
import Token from './token'

/**
 * Mention Token.
 */
const Mention = function(start, value) {
  Token.call(this, start, value)
}

Mention.prototype = Object.create(Token.prototype, {
  constructor: {
    value: Mention,
    enumerable: false
  }
})

/**
 * A Mention token is an '@' symbol
 * followed by a minimum of 3 alphanumeric
 * or underscore characters.
 *
 * @params start Number the position in `text`
 *   to start parsing at.
 * @params text String the text to parse.
 *
 * @returns Mention | Number - A new Mention token
 *   if one was found. The ending position if none
 *   was found.
 */
Mention.parse = function(start, text) {
  if (text[start] !== '@') {
    return start
  }

  var value = '@'
  var i = start

  for (i; i < text.length; i++) {
    if (new XRegExp('^[@\\pL0-9-]+$').test(text[i])) {
      value += text[i]
    } else {
      break
    }
  }

  if (value.length >= 1) {
    return new Mention(start, value)
  }

  return i
}

export default Mention
