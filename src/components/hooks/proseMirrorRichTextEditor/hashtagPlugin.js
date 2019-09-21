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
    const inlineDeco = Decoration.inline(hashtag.start + 1, hashtag.end + 1, {
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

const hashtagPlugin = ({
  addHashtag = () => 'not implemented',
  setHashtagUnderCursor = () => 'not implemented',
  hashtagHighlightIndex = 0,
  setHighlightIndex = () => 'not implemented'
}) => {
  return new Plugin({
    state: {
      init(_, instance) {
        return {
          pluginProps: {
            addHashtag,
            setHashtagUnderCursor,
            hashtagHighlightIndex,
            setHighlightIndex
          },
          decorations: decorateHashtags(instance.doc, instance.selection)
        }
      },

      apply(tr, { pluginProps, decorations: oldDecorationSet }) {
        const {
          addHashtag,
          setHashtagUnderCursor,
          hashtagHighlightIndex,
          setHighlightIndex
        } = pluginProps

        const hashtagUnderCursor = findHashtagUnderCursor(
          tr.doc,
          tr.curSelection
        )
        console.log('hashtag ', hashtagUnderCursor)
        setHashtagUnderCursor(hashtagUnderCursor)

        const newStateField = { pluginProps }
        let newIndex = hashtagHighlightIndex

        if (tr.getMeta('key') === 'up') {
          --newIndex
        } else if (tr.getMeta('key') === 'down') {
          ++newIndex
        } else if (hashtagUnderCursor === undefined) {
          newIndex = 0
        }
        setHighlightIndex(newIndex)
        newStateField.pluginProps.hashtagHighlightIndex = newIndex
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
        if (event.key === 'ArrowUp') {
          view.dispatch(view.state.tr.setMeta('key', 'up'))
          return true
        } else if (event.key === 'ArrowDown') {
          view.dispatch(view.state.tr.setMeta('key', 'down'))
          return true
        }
      }
    }
  })
}

export default hashtagPlugin
