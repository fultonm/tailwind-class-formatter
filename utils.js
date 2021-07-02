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
  pstrTemplateLiteralPlaceholderEnd,
  parrSortOrder
}) {
  const strWhitespacePrefix = ' '.repeat(pnumWhitespacePrefixLength)
  const strIndent = ' '.repeat(pnumTabSize)

  const strFormattedTruthyClasses = getFormattedClasses({
    pstrClasses: pstrTruthyClasses,
    pnumWhitespacePrefixLength: pnumWhitespacePrefixLength + strIndent.length,
    parrSortOrder
  })

  const strFormattedFalsyClasses = getFormattedClasses({
    pstrClasses: pstrFalsyClasses,
    pnumWhitespacePrefixLength: pnumWhitespacePrefixLength + strIndent.length,
    parrSortOrder
  })

  const strConditionalLines =
    pstrTemplateLiteralPlaceholderBegin + pstrCondition +
  '\n' + strWhitespacePrefix + strIndent + '? ' + pstrTruthyQuote + strFormattedTruthyClasses + pstrTruthyQuote +
  '\n' + strWhitespacePrefix + strIndent + ': ' + pstrFalsyQuote + strFormattedFalsyClasses + pstrFalsyQuote + pstrTemplateLiteralPlaceholderEnd

  let i = 1;
  return strConditionalLines
}

function getFormattedClasses({
  pstrClasses,
  pnumWhitespacePrefixLength,
  parrSortOrder
}) {
  const objClassIsolateRegex = /(\S+)/gm
  const arrClasses = []

  let iterClassMatch
  while ((iterClassMatch = objClassIsolateRegex.exec(pstrClasses)) !== null) {
    let strClass = iterClassMatch[1]
    arrClasses.push(strClass)
    objClassIsolateRegex.lastIndex++
  }

  if (arrClasses.length < 1) {
    return ''
  }

  arrClasses.sort((a, b) => {
    let aSortIndex = Number.MIN_SAFE_INTEGER
    let bSortIndex = Number.MIN_SAFE_INTEGER
    parrSortOrder.forEach((classPrefix, i) => {
      if (aSortIndex === Number.MAX_SAFE_INTEGER && a.startsWith(classPrefix)) {
        aSortIndex = i
      }
      if (bSortIndex === Number.MAX_SAFE_INTEGER && b.startsWith(classPrefix)) {
        bSortIndex = i
      }
    })
    if (aSortIndex < bSortIndex) {
      return -1
    } else if (aSortIndex > bSortIndex) {
      return 1
    }
    return 0
  })


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