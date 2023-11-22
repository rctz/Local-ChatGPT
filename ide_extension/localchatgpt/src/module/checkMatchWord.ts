import * as vscode from 'vscode';

import { getConfig } from "../config";


export function checkMatchWord(message:string):string | undefined {

    const matchPattern:RegExp = getConfig().matchPattern;

    const outRegEx = matchPattern.exec(message);

    if (outRegEx && outRegEx.length > 2) {
        console.log("VsCode : "+outRegEx[2]);
        return outRegEx[2];
    }

    return undefined;
}