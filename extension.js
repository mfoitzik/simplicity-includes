// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const includePrefix = 'sinclude_';
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('helloworld.mifo', function () {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Updated This is a test?');
	// });
	
	
// 	let mike = vscode.commands.registerCommand('helloworld.datetime', async function () {
// 		// The code you place here will be executed every time your command is executed
// 		try {
// 			replaceTextInDirtyFiles();
// 		}
// 		catch(err) {
// 			console.log("replacedirtytexterror: " + err);
// 		}
// 		const htmlFiles = await getHtmlFiles();
// 		console.log(htmlFiles.map(file => file.fsPath));
// 		for (const fileURI of htmlFiles) {
//             console.log("file uriX: " + fileURI.toString());
// 			console.log("file open? " + isFileOpen(fileURI.fsPath));
// 			const documentx = vscode.workspace.textDocuments.find(doc => doc.uri.fsPath === fileURI.fsPath);
// 			// Read the contents of the file
  
// 	try {
// 		vscode.workspace.fs.readFile(vscode.Uri.file(fileURI.fsPath)).then((contents) => {
//     // Modify the contents of the file
//     //const newContents = contents.toString() + '\nnew text';
// 	//console.log(newContents);
//     // Write the modified contents back to the file
//     //vscode.workspace.fs.writeFile(vscode.Uri.file(fileURI.fsPath), new TextEncoder().encode(newContents)).then(() => {
//       // Show a message indicating the file was modified
//       //vscode.window.showInformationMessage('File modified successfully.');
//     //});
//   });
// 	}	catch(err) {
// 		console.log("error: " + err);
// 	}
// 			// let textx = "";
// 			// try {
// 			// 	textx = documentx.getText();
// 			// }
// 			// catch(err) {
// 			// 	console.log("error: " + err);
// 			// }
			
// 			// try {
// 			// 	console.log("is dirty: " + documentx.isDirty);
// 			// }
// 			// catch(err) {
// 			// 	console.log("error: " + err);
// 			// }
// 			//console.log(textx);
// 			// if (documentx.isDirty) {
// 			// 	console.log("is dirty");
// 			// } else {
// 			// 	console.log("is not dirty");
// 			// }
			
// 			//console.log(documentx);
// 			//const isDocumentOpen = vscode.window.visibleTextEditors.some(doc => doc.uri.fsPath === fileURI.fsPath);
//             //if (isDocumentOpen) {
//             //    const document = vscode.workspace.textDocuments.find(doc => doc.uri.fsPath === fileURI.fsPath);
//                 //console.log(`File ${fileURI.toString()} is currently open in the workspace.`);
//                 //console.log(`The document is ${document.isDirty ? 'dirty' : 'not dirty'}.`);
//            ///} else {
//            //     const fileStat = await vscode.workspace.fs.stat(fileURI);
//                 //console.log(`File ${fileURI.toString()} is currently closed in the workspace.`);
//                 //console.log(`The file was last modified on ${fileStat.mtime.toLocaleString()}.`);
//             //}
//         }
// 		// if (htmlFiles.length === 0) {
// 		//   vscode.window.showInformationMessage('No Include files found.');
// 		// } else {
// 		//   vscode.window.showInformationMessage(`Found ${htmlFiles.length} Include files.`);
// 		//   console.log('Include files:', htmlFiles.map(file => file.fsPath));
// 		// }
// 		// // Display a message box to the user
// 		// let displaydate = new Date();
// 		// vscode.window.showInformationMessage(displaydate.toLocaleString());
// 	});

	let onSaveDisposable = vscode.workspace.onDidSaveTextDocument(document => {
		// Check if the saved file has the .html extension
		console.log("HI MIKE!");
		//console.log(path.basename(document.fileName));
		if (path.basename(document.fileName).startsWith(includePrefix)) {
		  onIncludeFileSaved(document);
		}
	  });

	context.subscriptions.push(onSaveDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {}
async function getHtmlFiles() {
	try {
	  // Define the glob pattern to search for .html files
	  const htmlFilePattern = '**/*.[hH][tT][mM][lL]';
  
	  // Search for .html files in the current workspace
	  const htmlFiles = await vscode.workspace.findFiles(htmlFilePattern, '**/{node_modules/**,include_*}');
  
	  return htmlFiles;
	} catch (err) {
	  console.error(err);
	  vscode.window.showErrorMessage('Failed to retrieve Include files.');
	  return [];
	}
  }

  async function onIncludeFileSaved(document) {
	
	// Your custom logic here
	const iText = document.getText();
	const outFilename = path.basename(document.fileName);
	replaceTextInDirtyFiles(outFilename, iText);
	const htmlFiles = await getHtmlFiles();
		console.log(htmlFiles.map(file => file.fsPath));
		for (const fileURI of htmlFiles) {
            //console.log("file uriX: " + fileURI.toString());
			//console.log("file open? " + isFileOpen(fileURI.fsPath));
			//const documentx = vscode.workspace.textDocuments.find(doc => doc.uri.fsPath === fileURI.fsPath);
			// Read the contents of the file
  
	try {
		vscode.workspace.fs.readFile(vscode.Uri.file(fileURI.fsPath)).then((contents) => {
			const startString = '<!--' + outFilename + '-->';
			const endString = '<!--/' + outFilename + '-->';

			// Create a regular expression that matches the portion of the string we want to replace
			const regex = new RegExp(`(${startString})(.*?)(${endString})`, 'g');
    // Modify the contents of the file
    const newContents = contents.replace(regex, `$1${iText}$3`);
	//console.log(newContents);
    // Write the modified contents back to the file
    vscode.workspace.fs.writeFile(vscode.Uri.file(fileURI.fsPath), new TextEncoder().encode(newContents)).then(() => {
      // Show a message indicating the file was modified
      //vscode.window.showInformationMessage('File modified successfully.');
    });
  });
	}	catch(err) {
		console.log("error: " + err);
	}
}
	
  }

//   function isFileOpen(filePath) {
// 	// Check if the file is open in a visible text editor
// 	const editor = vscode.window.visibleTextEditors.find(editor => editor.document.uri.fsPath === filePath);
// 	if (editor) {
// 	  return true;
// 	}
  
// 	// Check if the file is open as a text document
// 	const document = vscode.workspace.textDocuments.find(document => document.uri.fsPath === filePath);
// 	if (document) {
// 	  return true;
// 	}
  
// 	// The file is not open in a visible text editor or as a text document
// 	return false;
//   }

  function replaceTextInDirtyFiles(inFilename, newText) {
	// Get all open documents
	// /const htmlFiles = await vscode.workspace.findFiles(htmlFilePattern, '**/{node_modules/**,include_*}');
	const startString = '<!--' + inFilename + '-->';
	const endString = '<!--/' + inFilename + '-->';

	// Create a regular expression that matches the portion of the string we want to replace
	const regex = new RegExp(`(${startString})(.*?)(${endString})`, 'g');

	// Use the replace() method to perform the replacement
	//const newString = originalString.replace(regex, `$1${newText}$3`);
	const documents = vscode.workspace.textDocuments;
	//console.log("TEXT DOC COUNT: " + documents.length);
	// Iterate through each document and replace the text if the document is dirty
	documents.forEach((document) => {
	  //console.log("i am in function: " + document.fileName);
		const mainFileName = path.basename(document.fileName);
		if (document.isDirty && !mainFileName.startsWith(includePrefix)) {
		// Get the selection or the entire document if nothing is selected
		//const selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(document.lineCount, 0));
		//console.log("function I am dirty");
		const selection = new vscode.Selection(
			new vscode.Position(0, 0), // Start position (line 0, column 0)
			new vscode.Position(document.lineCount, 0) // End position (last line, column 0)
		  );
  
		// Get the text to replace
		const oldText = document.getText(selection);
			//console.log("DIRTY TEXT:");
			//console.log(oldText);
		// Get the text to replace with
		const newDocText = oldText.replace(regex, `$1${newText}$3`);
  
		// Create an edit to replace the old text with the new text
		//const edit = new vscode.TextEdit(selection, newText);
		//selection.replace(activeEditor.selection, newText);
		// Apply the text edit to the document using the workspace edit API
		const workspaceEdit = new vscode.WorkspaceEdit();
		workspaceEdit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), newDocText);
		vscode.workspace.applyEdit(workspaceEdit);
  
		// Apply the edit
		// document.save().then(() => {
		//   vscode.workspace.applyEdit(edit).then(() => {
		// 	// Show a message indicating the text was replaced
		// 	vscode.window.showInformationMessage('Text replaced successfully in ' + document.fileName);
		//   });
		// });
	  }
	});
  }
module.exports = {
	activate,
	deactivate
}
