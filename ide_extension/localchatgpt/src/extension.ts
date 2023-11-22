// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { checkMatchWord } from './module/checkMatchWord';
import { chatToGPT } from './module/chatToGPT';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"LocalChatGPT Extension" is now active!');
    
    const provider: vscode.CompletionItemProvider = {
        // @ts-ignore
        provideInlineCompletionItems: async (document, position, context, token) => {

            
            let completionItem = new vscode.CompletionItem('');

            /* */
            const textBeforeCursor = document.getText(

                new vscode.Range(position.with(undefined, 0), position)
            );

            const messageToGPT = checkMatchWord(textBeforeCursor);
            
            /* */
            if (messageToGPT !== undefined) {
                
                vscode.window.setStatusBarMessage("LocalChatGPT : Loading...");

                let chat_response = await chatToGPT(messageToGPT);

                if (chat_response === undefined) {

                    vscode.window.setStatusBarMessage("LocalChatGPT : Fail!");
                    return null;
                    
                }

                vscode.window.setStatusBarMessage("LocalChatGPT : Success!");

                chat_response = `\n${chat_response}`;

                //@ts-ignore
                completionItem = new vscode.CompletionItem(chat_response, vscode.CompletionItemKind.Text);                
                //@ts-ignore
                completionItem.range = new vscode.Range(position.translate(0, chat_response.length), position);
                //@ts-ignore
                completionItem.insertText = new vscode.SnippetString(chat_response);

                completionItem.documentation = new vscode.MarkdownString('Press Tab to compleate item');

                return [completionItem];
            }

            return [completionItem];
        },
        
    };

    //@ts-ignore
    let textPush:vscode.Disposable = vscode.languages.registerInlineCompletionItemProvider({pattern: "**"}, provider);
    

    context.subscriptions.push(textPush);
}

// This method is called when your extension is deactivated
export function deactivate() {}
