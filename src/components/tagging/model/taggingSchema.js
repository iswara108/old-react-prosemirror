import { Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { HASHTAG_SCHEMA_NODE_TYPE ,MENTION_SCHEMA_NODE_TYPE} from './taggingUtils'

// create the schema specs for an editor with hashtags.
export default function taggingSchema(multiline, disableMarks) {
  const schema = new Schema({
    nodes: schemaBasic.spec.nodes
      .addBefore('text', HASHTAG_SCHEMA_NODE_TYPE, {
        group: 'inline',
        atom: true,
        content: 'text*',
        inline: true,
        toDOM: node => ['hashtag', 0],
        parseDOM: [{ tag: 'hashtag' }],
        selectable: true,
        draggable: true
      })
      .addBefore('text', MENTION_SCHEMA_NODE_TYPE, {
        group: 'inline',
        atom: true,
        content: 'text*',
        inline: true,
        toDOM: node => ['mention', 0],
        parseDOM: [{ tag: 'mention' }],
        selectable: true,
        draggable: true
      })
      .update(
        'doc',
        multiline ? schemaBasic.spec.nodes.get('doc') : { content: 'block' }
      ),
    marks: disableMarks ? undefined : schemaBasic.spec.marks
  })
  return schema
}
