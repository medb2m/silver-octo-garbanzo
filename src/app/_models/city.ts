import { Account } from "./account";

export class City {
    _id!: string;
    name!: string;
    workers!: [Account];
    delegation!: string;
}