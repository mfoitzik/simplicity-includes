// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const includePrefix = "sinclude_";
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Simplicity-Include is now active.');
  let onSaveDisposable = vscode.workspace.onDidSaveTextDocument((document) => {
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
    const htmlFilePattern = "**/*.[hH][tT][mM][lL]";
	const htmlFiles = await vscode.workspace.findFiles(
      htmlFilePattern,
      "**/{node_modules/**,sinclude_*}"
    );

    return htmlFiles;
  } catch (err) {
    console.error(err);
    vscode.window.showErrorMessage("Failed to retrieve Include files.");
    return [];
  }
}

async function onIncludeFileSaved(document) {
  const iText = document.getText();
  const outFilename = path.basename(document.fileName);
  replaceTextInDirtyFiles(outFilename, iText);
  const htmlFiles = await getHtmlFiles();
  for (const fileURI of htmlFiles) {
    try {
      vscode.workspace.fs
        .readFile(vscode.Uri.file(fileURI.fsPath))
        .then((contents) => {
          const startString = escapeStringRegexp("<!--" + outFilename + "-->");
          const endString = escapeStringRegexp("<!--/" + outFilename + "-->");
          const textDecoder = new TextDecoder();
          const fileContents = textDecoder.decode(contents);
          const regex = new RegExp(
            `(${startString})([\\s\\S]*?)(${endString})`,
            "g"
          );
          let newContents;
          try {
            newContents = fileContents.replace(regex, `$1${iText}$3`);
          } catch (error) {
            console.log("Closed file error: " + error);
          }
          vscode.workspace.fs
            .writeFile(
              vscode.Uri.file(fileURI.fsPath),
              new TextEncoder().encode(newContents)
            )
            .then(() => {});
        });
    } catch (err) {
      console.log("error: " + err);
    }
  }
}

function escapeStringRegexp(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

async function replaceTextInDirtyFiles(inFilename, newText) {
  const startString = escapeStringRegexp("<!--" + inFilename + "-->");
  const endString = escapeStringRegexp("<!--/" + inFilename + "-->");

  const regex = new RegExp(`(${startString})([\\s\\S]*?)(${endString})`, "g");

  const documents = vscode.workspace.textDocuments;
  documents.forEach((document) => {
    const mainFileName = path.basename(document.fileName);
    if (document.isDirty && !mainFileName.startsWith(includePrefix)) {
      const selection = new vscode.Selection(
        new vscode.Position(0, 0),
        new vscode.Position(document.lineCount, 0)
      );

      const oldText = document.getText(selection);
      const newDocText = oldText.replace(regex, `$1${newText}$3`);

      const workspaceEdit = new vscode.WorkspaceEdit();
      workspaceEdit.replace(
        document.uri,
        new vscode.Range(0, 0, document.lineCount, 0),
        newDocText
      );
      vscode.workspace.applyEdit(workspaceEdit);
    }
  });
}

module.exports = {
  activate,
  deactivate,
};
