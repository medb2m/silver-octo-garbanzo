import { City } from "./city";
import { Delegation } from "./delegation";
import { Region } from "./region";
import { Account } from "./account";

export class Report {
    _id!: string;
    worker!: Account;
    date!: Date;
    content!: string;
    machaghel?: string;
    machakel_alyawm?: string;
    houloul?: string;
    concurence?: boolean;
    traiter?: boolean;
    concurrenceDetails?: string;
    propositions?: string;
    images?: string[];
    city!: City;
    delegation!: Delegation;
    region!: Region;
}
