import { Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { HASHTAG_SCHEMA_NODE_TYPE } from './hashtagUtils'

// create the schema specs for an editor with hashtags.
export default function hashtagSchema(multiline, disableMarks) {
  const schema = new Schema({
    nodes: schemaBasic.spec.nodes
      .addBefore('text', HASHTAG_SCHEMA_NODE_TYPE, {
        group: 'inline',
        atom: true,
        content: 'text*',
        inline: true,
        toDOM: node => [HASHTAG_SCHEMA_NODE_TYPE, 0],
        parseDOM: [{ tag: HASHTAG_SCHEMA_NODE_TYPE }],
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
