import XRegExp from 'xregexp'
import Token from './token'

/**
 * Hashtag token.
 */

class Hashtag extends Token {
  constructor(start: number, value: string) {
    super(start, value)
  }

  parse() {
    var value = '#'
    var i = this.start

    for (i; i < this.value.length; i++) {
      if (XRegExp('^[#\\pL0-9-]+$').test(this.value[i])) {
        value += this.value[i]
      } else {
        break
      }
    }

    if (value.length >= 1) {
      return new Hashtag(this.start, value)
    }
  }
}

export default Hashtag
