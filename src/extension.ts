"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Uri } from "vscode";
import * as fs from "fs";
import * as path from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "angular-electron-scaffolding" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.newAngularElectronProject",
    async () => {
      const inputOptions: vscode.InputBoxOptions = {
        prompt: "Enter a name for your new project",
        placeHolder: "project-name"
      };
      const name = await vscode.window.showInputBox(inputOptions);
      // tslint:disable-next-line:curly
      if (!name) return;

      // If already in a workspace, set the default folder to somethign nearby.
      const folders = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        openLabel: "Select a folder to create the project in"
      });
      // tslint:disable-next-line:curly
      if (!folders || folders.length !== 1) return;
      const folderUri = folders[0];
      const projectFolderUri = Uri.file(path.join(folderUri.fsPath, name));

      if (fs.existsSync(projectFolderUri.fsPath)) {
        vscode.window.showErrorMessage(
          `A folder named ${name} already exists in ${folderUri.fsPath}`
        );
        return;
      }

      fs.mkdirSync(projectFolderUri.fsPath);

      const terminal = vscode.window.createTerminal(
        "initialize project",
        projectFolderUri.fsPath
      );

      terminal.sendText("echo 'Sent text immediately after creating'");
      terminal.sendText("mkdir dikkmore");

      // Open the created folder
      vscode.commands.executeCommand(
        "vscode.openFolder",
        projectFolderUri,
        true
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
