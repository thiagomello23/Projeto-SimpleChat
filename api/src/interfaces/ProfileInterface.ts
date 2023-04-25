
// Interfaces referentes a rota de perfil
export interface Bio {
    bio: string;
}

export interface Name {
    name: string;
}

export interface Password {
    password: string;
}

export interface Status {
    status: "Online"|"Ausente"|"Ocupado"
}