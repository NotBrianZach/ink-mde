import { ink } from 'ink-mde'
import { buildBlockWidgetDecoration, nodeDecorator } from '/lib/codemirror-kit'

ink(document.querySelector('#app')!, {
  doc: '# Start with some text\n\n```\nhi\n```\n\n```\nhello\n```',
  plugins: [
    {
      type: 'default',
      value: nodeDecorator({
        nodes: ['FencedCode'],
        onMatch: (state, node) => {
          const text = state.sliceDoc(node.from, node.to).split('\n').slice(1, -1).join('\n')

          if (text) {
            return buildBlockWidgetDecoration({
              widget: {
                // You can see the results of optimization when there is no id specified. Because CodeMirror has no way of knowing
                // whether the decoration matches, it usually has to rebuild the DOM on each change. With the optimization setting,
                // the DOM only has to be rebuilt if the changes overlap with the existing decoration.
                //
                // With optimization enabled, the updated timestamp only updates when something inside that block changes.
                // With optimization disabled, the updated timestamp updates on *any* doc change.
                //
                // id: text,
                toDOM: () => {
                  return (
                    <div>
                      <div>DOM updated at: {Date.now()}</div>
                      <span>{text}</span>
                    </div>
                  ) as HTMLElement
                },
              },
            })
          }
        },
        // When set to true, only the nodes that overlap changed ranges will be reprocessed.
        optimize: true,
      }),
    },
  ],
})
