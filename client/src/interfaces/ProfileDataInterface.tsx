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

export type amigos = {
    nome: string;
    bio: string;
    email: string;
    profilePic: string;
    status: Status;
}