# React ProseMirror

A React wrapper for ProseMirror, alternative for DraftJS.
Provides easy to use Rich Text, mentions, hashtags, etc.

## Basic Usage

```jsx
import ReactProseMirror from './components/ReactProseMirror'

export default () => <ReactProseMirror />
```

## Reference

### Props

| Prop Name             | Description                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                    | HTML id property                                                                                                                                                          |
| label                 | TBD                                                                                                                                                                       |
| content               | JSON-serializeable representation of a [node](https://prosemirror.net/docs/ref/#model.Node). Read this [guide](https://prosemirror.net/docs/guide/#doc) for understanding |
| onChange              | Callback when the content has changed. For example: <br> `onChange={newContent => setContent(newContent)}`                                                                |  |
| hashtags              | "immutable" - for immutable hashtags                                                                                                                                      |
|                       | "mutable" - accepting any word prefixed by # as a hashtag                                                                                                                 |
| hashtagSuggestionList | Array of strings beginning with # to suggest                                                                                                                              |
| multiline             | Allow multiline                                                                                                                                                           |

### Example:

```jsx
const [hashtagListDynamic, setHashtagListDynamic] = useState(['#office', '#home'])

<ReactProseMirror
  id="prosemirror-hashtag-mutables"
  label="Hastag Prosemirror"
  hashtagSuggestionList={hashtagListDynamic}
  hashtags="mutable"
  multiline
  onNewHashtag={hashtag =>
    setHashtagListDynamic([...hashtagListDynamic, hashtag])
  }
/>
```
