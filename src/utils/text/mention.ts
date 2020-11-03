import { number } from 'prop-types'
import XRegExp from 'xregexp'
import Token from './token'

/**
 * Mention Token.
 */
class Mention extends Token {
  constructor(start: number, value: string) {
    super(start, value)
  }

  parse() {
    // if (this.value[this.start] !== '@') {
    //   return this.start
    // }

    var value = '@'
    var i = this.start

    for (i; i < this.value.length; i++) {
      if (XRegExp('^[@\\pL0-9-]+$').test(this.value[i])) {
        value += this.value[i]
      } else {
        break
      }
    }

    if (value.length >= 1) {
      return new Mention(this.start, value)
    }
  }
}

export default Mention
