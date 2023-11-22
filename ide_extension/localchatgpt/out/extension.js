"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const checkMatchWord_1 = require("./module/checkMatchWord");
const chatToGPT_1 = require("./module/chatToGPT");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"LocalChatGPT Extension" is now active!');
    const provider = {
        // @ts-ignore
        provideInlineCompletionItems: async (document, position, context, token) => {
            let completionItem = new vscode.CompletionItem('');
            /* */
            const textBeforeCursor = document.getText(new vscode.Range(position.with(undefined, 0), position));
            const messageToGPT = (0, checkMatchWord_1.checkMatchWord)(textBeforeCursor);
            /* */
            if (messageToGPT !== undefined) {
                vscode.window.setStatusBarMessage("LocalChatGPT : Loading...");
                let chat_response = await (0, chatToGPT_1.chatToGPT)(messageToGPT);
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
    let textPush = vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);
    context.subscriptions.push(textPush);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map