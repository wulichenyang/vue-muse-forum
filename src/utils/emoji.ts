import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import data from 'emoji-mart-vue-fast/data/all.json'

let emojiIndex = new EmojiIndex(data)

/**
 * convert emoji object to html `<span>`s.
 */
export function emoji2Html(emoji: any): string {
  return `<span data-title="${emoji.colons.replace(/:/g, '')}" class="emoji-mart-emoji"><span class="emoji-set-apple emoji-type-image" style="background-position: ${emoji.getPosition()}; width: 24px; height: 24px;"></span></span>`
}


/**
 * replace emoji object to html `<span>`s in content.
 */
export function showEmoji(content: string): string {
  return content.replace(/\:([a-zA-Z0-9-_+]+)\:/g, (match, p1) => {
    console.log(`:${p1}:`)
    let position = emojiIndex.findEmoji(`${p1}`).getPosition();
    console.log(position)
    return `<span data-title="${p1}" class="emoji-mart-emoji"><span class="emoji-set-apple emoji-type-image" style="background-position: ${position}; width: 24px; height: 24px;"></span></span>`
  })
}