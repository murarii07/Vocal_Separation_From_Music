"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listId = void 0;
exports.userIdGenerator = userIdGenerator;
const crypto_1 = require("crypto");
class listId {
    idList = [];
    listAdd(element) {
        this.idList.push(element);
    }
    listRemove(element) {
        this.idList.splice(this.idList.indexOf(element), 1);
    }
    isExist(element) {
        return this.idList.includes(element);
    }
    getRetrival() {
        return [...this.idList];
    }
}
exports.listId = listId;
function userIdGenerator() {
    return (0, crypto_1.randomBytes)(16).toString("hex");
}
