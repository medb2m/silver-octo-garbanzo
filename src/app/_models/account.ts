import { City } from './city';
import { Delegation } from './delegation';
import { Region } from './region';
import { Role } from './role';

export class Account {
    id: string = "";
    username!: string;
    fullName!: string;
    cin!: Number;
    role?: Role;
    jwtToken?: string;
    image?:string;
    moderatorZone?: string;
    city!: City;
    region?:string;
    delegation?:string;
    moderatorRegion?: Region;
    moderatorDelegation?: Delegation;
}