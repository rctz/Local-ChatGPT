import * as vscode from 'vscode';

type IConfig = {
    matchPattern: RegExp

};


export function getConfig() {
    
    return {
        matchPattern: /(\/\/|#|--|<!--)\s?Hi Chat\s?(.+)\s?(\.|-->)/,

    } as IConfig;
}