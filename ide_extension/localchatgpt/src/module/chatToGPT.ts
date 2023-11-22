import { read } from 'fs';
import * as vscode from 'vscode';


export async function chatToGPT(message:string): Promise<String|undefined> {
    
    try {
        const response = await fetch("http://localhost:8000/api/chat_stream",{
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
            console.log("LocalChatGPT : "+textResponse);
            return textResponse;
        } else {
            console.error('Error:', response.status, response.statusText);
        }
 
    }catch (error) {
        vscode.window.showErrorMessage("Can't sent message to GPT");
    }

    return undefined;
}