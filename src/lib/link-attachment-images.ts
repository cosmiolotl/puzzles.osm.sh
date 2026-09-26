import type { Element, Root } from 'hast'

export function linkAttachmentImages() {
  return (tree: Root) => {
    function visit(parent: Root | Element) {
      for (let index = 0; index < parent.children.length; index++) {
        const child = parent.children[index]
        if (child.type !== 'element' || child.tagName === 'a') continue

        const source = child.properties.src
        if (child.tagName === 'img' && typeof source === 'string' && source) {
          parent.children[index] = {
            type: 'element',
            tagName: 'a',
            properties: {
              href: source,
              title: 'View image at full size',
              className: ['cursor-zoom-in'],
            },
            children: [child],
          }
          continue
        }
        visit(child)
      }
    }
    visit(tree)
  }
}
