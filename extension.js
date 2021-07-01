// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

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

		// Display a message box to the user

		let documentContent = editor.document.getText()

		const documentRegex = /className=(["'`])([\s\S]*?)(\1)/g
		const tailwindIsolateRegex = /(\s*)(\S+)/g


		let match
		while ((match = documentRegex.exec(documentContent)) != null) {
			const tailwindIsolate = match[2]

			let tailwindClass
			let numWhitespace = 6
			const newClasses = []

			while ((tailwindClass = tailwindIsolateRegex.exec(tailwindIsolate)) != null) {
				newClasses.push(tailwindClass[2])
				tailwindIsolateRegex.lastIndex++
			}

			const quote = match[1]
			let replacement = `className=${quote}${newClasses[0]}`
			for (let i = 1; i < newClasses.length; i++) {
				replacement += `\n${' '.repeat(numWhitespace)}${newClasses[i]}`
			}
			replacement += quote
			const startPos = editor.document.positionAt(match.index)
			const matchLength = match[0].length
			const endPos = editor.document.positionAt(match.index + matchLength)
			const range = new vscode.Range(startPos, endPos)

			edit.replace(range, replacement)

			documentRegex.lastIndex++
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
