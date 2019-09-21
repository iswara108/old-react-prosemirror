import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'
import Tokenizer from '../../../utils/text/tokenizer'
import './hashtag.css'

const getTokens = doc => {
  let tokens = { hashtags: [], mentions: [] }

  doc.descendants(node => {
    if (node.isText) {
      tokens = Object.assign(tokens, Tokenizer(node.text))
    }
  })
  return tokens
}

function decorateHashtags(doc, selection) {
  let decorations = []
  const tokens = getTokens(doc)

  tokens.hashtags.forEach(hashtag => {
    const inlineDeco = Decoration.inline(hashtag.start + 1, hashtag.end + 2, {
      class: 'hashtag'
    })

    decorations.push(inlineDeco)
  })

  return DecorationSet.create(doc, decorations)
}

const findHashtagUnderCursor = (doc, selection) => {
  const tokens = getTokens(doc)

  const lowestSelection = Math.min(selection.anchor, selection.head)
  const highestSelection = Math.max(selection.anchor, selection.head)

  return tokens.hashtags.find(
    hashtag =>
      hashtag.start + 1 <= lowestSelection &&
      hashtag.end + 2 >= highestSelection
  )
}

const hashtagPlugin = pluginProps => {
  return new Plugin({
    state: {
      init(_, instance) {
        return {
          pluginProps,
          decorations: decorateHashtags(instance.doc, instance.selection)
        }
      },

      apply(
        tr,
        {
          pluginProps: { addHashtag, setHashtagUnderCursor },
          decorations: oldDecorationSet
        }
      ) {
        setHashtagUnderCursor(findHashtagUnderCursor(tr.doc, tr.curSelection))

        const newStateField = { pluginProps }
        newStateField.decorations = tr.docChanged
          ? decorateHashtags(tr.doc, tr.curSelection)
          : oldDecorationSet
        return newStateField
      }
    },

    props: {
      decorations(editorState) {
        return this.getState(editorState).decorations
      }
    }
  })
}

export default hashtagPlugin
