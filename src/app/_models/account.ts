import { City } from './city';
import { Role } from './role';

export class Account {
    id: string = "";
    username!: string;
    fullName!: string;
    cin!: Number;
    email?: string;
    role?: Role;
    jwtToken?: string;
    image?:string;
    moderatorZone?: string;
    city!: City
}