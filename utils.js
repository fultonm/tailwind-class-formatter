/**
 * Regex draft
 * className=\{`([\s\S]*?)\${\s*([\s\S]+?)\s*?\?\s*(['"])([\s\S]*?)\3\s*\:\s*(['"])([\s\S]*?)\5\}\s*([\s\S]*?)`\}|className=(["'])([\s\S]*?)\8
 */

function getConditionalClassLines({
  pstrCondition,
  pstrTruthyQuote,
  pstrTruthyClasses, 
  pstrFalsyQuote, 
  pstrFalsyClasses,
  pnumWhitespacePrefixLength,
  pnumTabSize = 2,
  pstrTemplateLiteralPlaceholderBegin,
  pstrTemplateLiteralPlaceholderEnd
}) {
  const strWhitespacePrefix = ' '.repeat(pnumWhitespacePrefixLength)
  const strIndent = ' '.repeat(pnumTabSize)

  const strFormattedTruthyClasses = getFormattedClasses({
    pstrClasses: pstrTruthyClasses,
    pnumWhitespacePrefixLength: pnumWhitespacePrefixLength + strIndent.length
  })

  const strFormattedFalsyClasses = getFormattedClasses({
    pstrClasses: pstrFalsyClasses,
    pnumWhitespacePrefixLength: pnumWhitespacePrefixLength + strIndent.length
  })


  const strConditionalLines =
    pstrTemplateLiteralPlaceholderBegin + pstrCondition +
  '\n' + strWhitespacePrefix + strIndent + '? ' + pstrTruthyQuote + strFormattedTruthyClasses + pstrTruthyQuote +
  '\n' + strWhitespacePrefix + strIndent + ': ' + pstrFalsyQuote + strFormattedFalsyClasses + pstrFalsyQuote + pstrTemplateLiteralPlaceholderEnd +
  '\n'

  return strConditionalLines
}

function getFormattedClasses({
  pstrClasses,
  pnumWhitespacePrefixLength
}) {
  const objClassIsolateRegex = /(\S+)/gm
  const arrClasses = []

  let iterClassMatch
  while ((iterClassMatch = objClassIsolateRegex.exec(pstrClasses)) !== null) {
    let strClass = iterClassMatch[1]
    arrClasses.push(strClass)
    objClassIsolateRegex.lastIndex++
  }

  let strFormattedClasses = `${arrClasses[0]}`
  for (let i = 1; i < arrClasses.length; i++) {
    strFormattedClasses += `\n${' '.repeat(pnumWhitespacePrefixLength)}${arrClasses[i]}`
  }
  return strFormattedClasses
}

function getConditionalsFromTemplateLiteral(pstrTemplateLiteralContent) {
  const objConditionalRegex = /\${([\s\S]*?)\s*\?\s*(['"`])([\s\S]*?)\2\s*:\s*(['"`])([\s\S]*?)\4}/gm
  let strTemplateLiteralSansConditionals = pstrTemplateLiteralContent
  const arrConditionals = []
  strTemplateLiteralSansConditionals = strTemplateLiteralSansConditionals.replace(objConditionalRegex,
    (pstrMatch,
      pstrCondition,
      pstrTruthyQuote,
      pstrTruthyClasses, 
      pstrFalsyQuote, 
      pstrFalsyClasses) => {
        arrConditionals.push({
          pstrCondition,
          pstrTruthyQuote: '`',
          pstrTruthyClasses,
          pstrFalsyQuote: '`',
          pstrFalsyClasses
        })
        return ''
    })
  return {
    strStaticClasses: strTemplateLiteralSansConditionals,
    arrConditionals
  }
}

module.exports = {
  getFormattedClasses,
  getConditionalClassLines,
  getConditionalsFromTemplateLiteral
}