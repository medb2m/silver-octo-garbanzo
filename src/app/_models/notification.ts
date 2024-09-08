import { Account } from "./account";

export class Notification {
    _id!: string;
    message!: string;
    reportId!: string;
    city!: string;
    date!: Date;
    isRead!: boolean;
    user!: Account
}