import Hashtag from './hashtag'
import Mention from './mention'

/**
 * TokenizerJS
 *
 * @param text String input to be tokenized.
 * @returns object Entites containing array of
 *   hashtags, mentions, and links.
 */
export default text => {
  var entities = {
    hashtags: [],
    mentions: []
  }

  for (var i = 0; i <= text.length; i++) {
    if (text[i] === '#') {
      var hashtag = Hashtag.parse(i, text)
      hashtag.value = hashtag.value.slice(1)

      if (typeof hashtag !== 'number') {
        i = hashtag.end
        entities.hashtags.push(hashtag)
      }
    } else if (text[i] === '@') {
      var mention = Mention.parse(i, text)

      if (typeof mention !== 'number') {
        i = mention.end
        entities.mentions.push(mention)
      }
    }
  }

  return entities
}
