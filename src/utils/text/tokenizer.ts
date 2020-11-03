import Hashtag from './hashtag'
import Mention from './mention'

/**
 * TokenizerJS
 *
 * @param text String input to be tokenized.
 * @returns object Entites containing array of
 *   hashtags, mentions, and links.
 */
const tokenizer = (text: string) => {
  const entities: { hashtags: Array<Hashtag>; mentions: Array<Mention> } = {
    hashtags: [],
    mentions: []
  }

  for (let i = 0; i <= text.length; i++) {
    if (text[i] === '#') {
      const hashtag = new Hashtag(i, text).parse()
      if (hashtag) {
        hashtag.value = hashtag.value.slice(1)

        if (typeof hashtag !== 'number') {
          i = hashtag.end
          entities.hashtags.push(hashtag)
        }
      }
    } else if (text[i] === '@') {
      const mention = new Mention(i, text).parse()
      if (mention) {
        mention.value = mention.value.slice(1)

        if (typeof mention !== 'number') {
          i = mention.end
          entities.mentions.push(mention)
        }
      }
    }
  }

  return entities
}

export default tokenizer
