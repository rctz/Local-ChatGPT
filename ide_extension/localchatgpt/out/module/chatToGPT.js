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
exports.chatToGPT = void 0;
const vscode = __importStar(require("vscode"));
async function chatToGPT(message) {
    try {
        const response = await fetch("http://localhost:8000/api/chat_stream", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json, text/plain, */*',
            },
            body: JSON.stringify({
                message: message
            }),
        });
        if (response.ok) {
            // Read the response as text
            const textResponse = await response.text();
            console.log("LocalChatGPT : " + textResponse);
            return textResponse;
        }
        else {
            console.error('Error:', response.status, response.statusText);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage("Can't sent message to GPT");
    }
    return undefined;
}
exports.chatToGPT = chatToGPT;
//# sourceMappingURL=chatToGPT.js.map