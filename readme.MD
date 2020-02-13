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

| Prop Name          | Description                                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | HTML id property                                                                                                                                                                                      |
| label              | TBD                                                                                                                                                                                                   |
| defaultValue       | Uncontrolled: JSON-serializeable representation of a [node](https://prosemirror.net/docs/ref/#model.Node). Read this [guide](https://prosemirror.net/docs/guide/#doc) for understanding               |
| value              | Controlled React Component: JSON-serializeable representation of a [node](https://prosemirror.net/docs/ref/#model.Node). Read this [guide](https://prosemirror.net/docs/guide/#doc) for understanding |
| onChange           | Controlled React Component: Callback when the content has changed. For example: <br> `onChange={newContent => setContent(newContent)}`                                                                |  |
| mentions           | "immutable" - for immutable hashtag & person mentions                                                                                                                                                 |
|                    | "mutable" - accepting any word prefixed by # as a hashtag. Not supported at the moment                                                                                                                |
| hashtagSuggestions | Array of strings beginning with # to suggest                                                                                                                                                          |
| multiline          | Allow multiline                                                                                                                                                                                       |

### Example:

```jsx
const [hashtagListDynamic, setHashtagListDynamic] = useState(['#office', '#home'])

<ReactProseMirror
  id="prosemirror-hashtag-mutables"
  label="Hastag Prosemirror"
  hashtagSuggestions={hashtagListDynamic}
  hashtags="mutable"
  multiline
  onNewHashtag={hashtag =>
    setHashtagListDynamic([...hashtagListDynamic, hashtag])
  }
/>
```
