import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'
import Tokenizer from '../../../utils/text/tokenizer'
import './hashtag.css'

const getTokens = doc => {
  let tokens = { hashtags: [], mentions: [] }
  doc.descendants((node, pos, parent) => {
    if (parent.type.name === 'hashtag') return false
    if (node.isText && node.type.name !== 'hashtag') {
      const token = Tokenizer(node.text)
      token.hashtags = token.hashtags.map(hashtag => ({
        start: hashtag.start + pos - 1,
        end: hashtag.end + pos - 1,
        value: hashtag.value
      }))
      tokens = Object.assign(tokens, token)
    }
  })
  return tokens
}

function decorateHashtags(doc, selection) {
  let decorations = []
  const tokens = getTokens(doc)
  console.log(tokens)
  tokens.hashtags.forEach(hashtag => {
    const inlineDeco = Decoration.inline(hashtag.start + 1, hashtag.end + 1, {
      class: 'hashtag-under-construction'
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
      hashtag.end + 1 >= highestSelection
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

      apply(tr, { pluginProps, decorations: oldDecorationSet }) {
        const {
          addHashtag,
          setHashtagUnderConstruction,
          moveHighlightIndex
        } = pluginProps

        const hashtagUnderCursor = findHashtagUnderCursor(
          tr.doc,
          tr.curSelection
        )
        setHashtagUnderConstruction(hashtagUnderCursor)

        const newStateField = { pluginProps }

        if (tr.getMeta('key') === 'up') {
          moveHighlightIndex(null, -1)
        } else if (tr.getMeta('key') === 'down') {
          moveHighlightIndex(null, 1)
        }
        newStateField.decorations = tr.docChanged
          ? decorateHashtags(tr.doc, tr.curSelection)
          : oldDecorationSet
        return newStateField
      }
    },

    props: {
      decorations(editorState) {
        return this.getState(editorState).decorations
      },
      handleKeyDown(view, event) {
        switch (event.key) {
          case 'ArrowUp':
            view.dispatch(view.state.tr.setMeta('key', 'up'))
            return true
          case 'ArrowDown':
            view.dispatch(view.state.tr.setMeta('key', 'down'))
            return true
          case 'Enter':
            if (this.getState(view.state).pluginProps) {
              this.setHighlightedAsSelected()
            }
            return true
          case 'Escape':
            debugger
            this.closeList()
            return true
          default:
            console.log('key', event.key)
        }
      }
    }
  })
}

export default hashtagPlugin
