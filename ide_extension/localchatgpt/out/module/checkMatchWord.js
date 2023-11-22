"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMatchWord = void 0;
const config_1 = require("../config");
function checkMatchWord(message) {
    const matchPattern = (0, config_1.getConfig)().matchPattern;
    const outRegEx = matchPattern.exec(message);
    if (outRegEx && outRegEx.length > 2) {
        console.log("VsCode : " + outRegEx[2]);
        return outRegEx[2];
    }
    return undefined;
}
exports.checkMatchWord = checkMatchWord;
//# sourceMappingURL=checkMatchWord.js.map