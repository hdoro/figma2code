/***
 * Modified version of the Regex Markdown Parser by chalarangelo
 * See source at https://github.com/Chalarangelo/parse-md-js
 ***/
const replaceRegex = function(regex, replacement) {
  return function(str) {
    return str.replace(regex, replacement)
  }
}

// @TODO: support __ for bold and _ for italics
const linkRegex = /\[([^\[]+)\]\(([^\)]+)\)/g
const boldItalicsRegex = /(\*{1,2})(.*?)\1/g
const unorderedListRegex = /(\n\s*(\-|\+)\s.*)+/g
const orderedListRegex = /(\n\s*([0-9]+\.)\s.*)+/g
const paragraphRegex = /\n+(?!<pre>)(?!<h)(?!<ul>)(?!<blockquote)(?!<hr)(?!\t)([^\n]+)\n/g

const linkReplacer = function(fullMatch, tagTitle, tagURL) {
  return '<a href="' + tagURL + '">' + tagTitle + '</a>'
}
const boldItalicsReplacer = function(fullMatch, tagStart, tagContents) {
  return (
    '<' +
    (tagStart.trim().length == 1 ? 'em' : 'strong') +
    '>' +
    tagContents +
    '</' +
    (tagStart.trim().length == 1 ? 'em' : 'strong') +
    '>'
  )
}
const unorderedListReplacer = function(fullMatch) {
  let items = ''
  fullMatch
    .trim()
    .split('\n')
    .forEach(item => {
      items += '<li>' + item.substring(2) + '</li>'
    })
  return '\n<ul>' + items + '</ul>'
}
const orderedListReplacer = function(fullMatch) {
  let items = ''
  fullMatch
    .trim()
    .split('\n')
    .forEach(item => {
      items += '<li>' + item.substring(item.indexOf('.') + 2) + '</li>'
    })
  return '\n<ol>' + items + '</ol>'
}
const paragraphReplacer = function(fullMatch, tagContents) {
  return '<p>' + tagContents + '</p>'
}

const replaceLinks = replaceRegex(linkRegex, linkReplacer)
const replaceBoldItalics = replaceRegex(boldItalicsRegex, boldItalicsReplacer)
const replaceUnorderedLists = replaceRegex(
  unorderedListRegex,
  unorderedListReplacer
)
const replaceOrderedLists = replaceRegex(orderedListRegex, orderedListReplacer)
const replaceParagraphs = replaceRegex(paragraphRegex, paragraphReplacer)

const replaceInlineMarkdown = str => {
  return replaceOrderedLists(
    replaceUnorderedLists(replaceBoldItalics(replaceLinks(str)))
  )
}

const replaceMarkdown = function(str) {
  return replaceParagraphs(replaceInlineMarkdown(str))
}

export function parseBlockMarkdown(str) {
  return replaceMarkdown('\n' + str + '\n').trim()
}

export function parseInlineMarkdown(str) {
  return replaceInlineMarkdown('\n' + str + '\n').trim()
}
