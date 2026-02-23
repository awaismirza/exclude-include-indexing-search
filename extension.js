// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "exclude-include-indexing-search" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const helloDisposable = vscode.commands.registerCommand('exclude-include-indexing-search.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from exclude-include-indexing-search!');
	});
	context.subscriptions.push(helloDisposable);

	// Exclude folder from search
	const excludeDisposable = vscode.commands.registerCommand('exclude-include-indexing-search.excludeFolderFromSearch', async (resourceUri) => {
		if (!resourceUri || !resourceUri.fsPath) {
			vscode.window.showErrorMessage('No folder selected.');
			return;
		}
		const folderPath = resourceUri.fsPath.replace(/\\/g, '/');
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(resourceUri);
		if (!workspaceFolder) {
			vscode.window.showErrorMessage('Selected folder is not in a workspace.');
			return;
		}
		const relPath = vscode.workspace.asRelativePath(folderPath, false);
		const config = vscode.workspace.getConfiguration('search', workspaceFolder.uri);
		let excludes = config.get('exclude') || {};
		if (!excludes[relPath + '/**']) {
			excludes[relPath + '/**'] = true;
			await config.update('exclude', excludes, vscode.ConfigurationTarget.workspace);
			vscode.window.showInformationMessage(`Excluded '${relPath}' from search.`);
		} else {
			vscode.window.showInformationMessage(`'${relPath}' is already excluded from search.`);
		}
	});
	context.subscriptions.push(excludeDisposable);

	// Include folder in search
	const includeDisposable = vscode.commands.registerCommand('exclude-include-indexing-search.includeFolderInSearch', async (resourceUri) => {
		if (!resourceUri || !resourceUri.fsPath) {
			vscode.window.showErrorMessage('No folder selected.');
			return;
		}
		const folderPath = resourceUri.fsPath.replace(/\\/g, '/');
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(resourceUri);
		if (!workspaceFolder) {
			vscode.window.showErrorMessage('Selected folder is not in a workspace.');
			return;
		}
		const relPath = vscode.workspace.asRelativePath(folderPath, false);
		const config = vscode.workspace.getConfiguration('search', workspaceFolder.uri);
		let excludes = config.get('exclude') || {};
		if (excludes[relPath + '/**']) {
			delete excludes[relPath + '/**'];
			await config.update('exclude', excludes, vscode.ConfigurationTarget.workspace);
			vscode.window.showInformationMessage(`Included '${relPath}' in search.`);
		} else {
			vscode.window.showInformationMessage(`'${relPath}' is already included in search.`);
		}
	});
	context.subscriptions.push(includeDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
