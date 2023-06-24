import { Status } from "./types/Status";

export interface ProfileInterface {
    nome: string;
    bio: string;
    email: string;
    profilePic: string;
    status: Status;
    senha?: string;
    amigos?: amigos[];
}

export interface AmigoInterface {
    id: string;
    amigos: amigos[]
}

export type amigos = {
    _id: string;
    nome: string;
    bio: string;
    email: string;
    profilePic: string;
    status: Status;
}