// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const utils = require('./utils')

const cstrJsxClassPropertyPrefix = 'className='
const cstrJsxTemplateLiteralBegin = '{`'
const cstrJsxTemplateLiteralEnd = '`}'
const cstrJsxTemplateLiteralPlaceholderBegin = '${'
const cstrJsxTemplateLiteralPlaceholderEnd = '}'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tailwind-class-formatter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('tailwind-class-formatter.formatTailwind', function (editor, edit) {
		// The code you place here will be executed every time your command is executed
		const config = vscode.workspace.getConfiguration();
		const enabled = config.get('tailwind-class-formatter.enable');
		if (!enabled) {
			return
		}
		const blnNonTailwindClassBefore = config.get('tailwind-class-formatter.nonTailwindClassBefore');
		const arrSortOrder = config.get('tailwind-class-formatter.sortOrder').slice();
		arrSortOrder.reverse()
		const numTabSize = config.get('editor.tabSize')
		const blnInsertSpace = config.get('editor.insertSpace')
		// If support for other languages will be considered we may use these in the future.
		const strClassPropertyPrefix = cstrJsxClassPropertyPrefix
		const strTemplateLiteralBegin = cstrJsxTemplateLiteralBegin
		const strTemplateLiteralEnd = cstrJsxTemplateLiteralEnd
		const strTemplateLiteralPlaceholderBegin = cstrJsxTemplateLiteralPlaceholderBegin
		const strTemplateLiteralPlaceholderEnd = cstrJsxTemplateLiteralPlaceholderEnd
		let strDocumentContent = editor.document.getText()
		const objDocumentRegex = /className=\{`([\s\S]*?)`}|className=(["'])([\s\S]*?)\2/gm
		let iterDocumentMatch
		while ((iterDocumentMatch = objDocumentRegex.exec(strDocumentContent)) != null) {
			let strReplacement = strClassPropertyPrefix
			if (iterDocumentMatch[2] !== undefined) {
				// Static classes
				const strQuote = iterDocumentMatch[2]
				const strClasses = iterDocumentMatch[3]
				const numWhitespacePrefixLength = editor.document.positionAt(iterDocumentMatch.index + 11).character
				const strFormattedClasses = utils.getFormattedClasses({
					pstrClasses: strClasses,
					pnumWhitespacePrefixLength: numWhitespacePrefixLength,
					parrSortOrder: arrSortOrder
				})
				strReplacement += strQuote + strFormattedClasses + strQuote
			} else {
				// Conditional classes
				strReplacement += strTemplateLiteralBegin
				const strTemplateLiteralContent = iterDocumentMatch[1]
				const { strStaticClasses, arrConditionals } = utils.getConditionalsFromTemplateLiteral(strTemplateLiteralContent)
				const numWhitespacePrefixLength = editor.document.positionAt(iterDocumentMatch.index + 12).character
				arrConditionals.forEach((objConditional, i) => {
					const strConditionalClassLines = utils.getConditionalClassLines({
						...objConditional,
						pnumWhitespacePrefixLength: numWhitespacePrefixLength,
						pnumTabSize: numTabSize,
						pstrTemplateLiteralPlaceholderBegin: strTemplateLiteralPlaceholderBegin,
						pstrTemplateLiteralPlaceholderEnd: strTemplateLiteralPlaceholderEnd,
						parrSortOrder: arrSortOrder
					})
					const strSubsequentNewline = i > 0 ? '\n' : ''
					strReplacement += strSubsequentNewline + strConditionalClassLines
				})
				const strFormattedStaticClasses = utils.getFormattedClasses({
					pstrClasses: strStaticClasses,
					pnumWhitespacePrefixLength: numWhitespacePrefixLength,
					parrSortOrder: arrSortOrder
				})
				strReplacement += strFormattedStaticClasses + strTemplateLiteralEnd		
			}
			const objStartPos = editor.document.positionAt(iterDocumentMatch.index)
			const objEndPos = editor.document.positionAt(iterDocumentMatch.index + iterDocumentMatch[0].length)
			const objRange = new vscode.Range(objStartPos, objEndPos)
			edit.replace(objRange, strReplacement)
			objDocumentRegex.lastIndex++
		}

	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
