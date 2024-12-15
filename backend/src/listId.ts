import { randomBytes } from "crypto";

export class listId {
    private idList: string[] = [];

    listAdd(element: string) {
        this.idList.push(element);
    }
    listRemove(element: string) {
        this.idList.splice(this.idList.indexOf(element), 1);
    }
    isExist(element: string): boolean {
        return this.idList.includes(element)
    }
    getRetrival(): string[] {
        return [...this.idList]
    }

}
export function userIdGenerator(): string {
    return randomBytes(16).toString("hex")
}
