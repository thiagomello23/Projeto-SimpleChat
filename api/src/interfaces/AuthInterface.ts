
// Interfaces referentes a rota de autenticacao
export interface Register {
    nome: string;
    email: string;
    senha: string;
}

export interface Login {
    email: string;
    senha: string
}