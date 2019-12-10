const prettier = require("prettier");

function addFile(content, parser) {
  const string =
    typeof content === "string" ? content : JSON.stringify(content, null, 2);
  const formatted = parser
    ? prettier.format(string, { semi: false, parser })
    : string;
  return {
    contents: Buffer.from(formatted)
  };
}

exports.addFile = addFile;

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

exports.capitalize = capitalize;

function camelCase(str) {
  return str[0].toLowerCase() + str.slice(1);
}

exports.camelCase = camelCase;

const IGNORED_CHARS = ['_', '-']

function camelToHyphen(name) {
  return name.split('').reduce((acc, cur) => {
    const isUppercase = IGNORED_CHARS.indexOf(cur) < 0 && cur.toUpperCase() === cur
    return `${acc}${isUppercase ? `-${cur.toLowerCase()}` : cur}`
  }, '')
}

exports.camelToHyphen = camelToHyphen