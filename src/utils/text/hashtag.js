import XRegExp from 'xregexp'
import Token from './token'

/**
 * Hashtag token.
 */
const Hashtag = function(start, value) {
  Token.call(this, start, value)
}

Hashtag.prototype = Object.create(Token.prototype, {
  constructor: {
    value: Hashtag,
    enumerable: false
  }
})

/**
 * Hashtags start with a '#' followed
 * by an series of alphanumeric characters.
 *
 * @params start Number the position in `text`
 *   to start parsing at.
 * @params text String the text to parse.
 *
 * @returns Hashtag | Number - A new Hashtag token
 *   if one was found. The ending position if none
 *   was found.
 */
Hashtag.parse = function(start, text) {
  if (text[start] !== '#') {
    return start
  }

  var value = '#'
  var i = start
  for (i; i < text.length; i++) {
    if (new XRegExp('^[#\\pL-]+$').test(text[i])) {
      value += text[i]
    } else {
      break
    }
  }

  if (value.length >= 1) {
    return new Hashtag(start, value)
  }

  return i
}

export default Hashtag
