import { NodeSpec, Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import {
  HASHTAG_SCHEMA_NODE_TYPE,
  MENTION_SCHEMA_NODE_TYPE
} from './taggingUtils'
import { default as OrderedMap } from 'orderedmap'
// create the schema specs for an editor with hashtags.
export default function taggingSchema(
  multiline: boolean,
  disableMarks: boolean
) {
  const schema = new Schema({
    nodes: (schemaBasic.spec.nodes as OrderedMap<NodeSpec>)
      .addBefore('text', HASHTAG_SCHEMA_NODE_TYPE, {
        group: 'inline',
        atom: true,
        content: 'text*',
        inline: true,
        toDOM: _ => ['hashtag', 0],
        parseDOM: [{ tag: 'hashtag' }],
        selectable: true,
        draggable: true
      })
      .addBefore('text', MENTION_SCHEMA_NODE_TYPE, {
        group: 'inline',
        atom: true,
        content: 'text*',
        inline: true,
        toDOM: _ => ['mention', 0],
        parseDOM: [{ tag: 'mention' }],
        selectable: true,
        draggable: true
      })
      .update(
        'doc',
        multiline
          ? (schemaBasic.spec.nodes as OrderedMap<NodeSpec>).get('doc')!
          : { content: 'block' }
      ),
    marks: disableMarks ? undefined : schemaBasic.spec.marks
  })

  return schema
}
