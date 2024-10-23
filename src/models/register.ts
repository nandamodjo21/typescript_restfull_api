export type RegisterRequest = {
    name: string;
    username: string;
    email: string;
    whatsapp: string;
    password: string;
}

export type ActivateRequest = {
    email:string;
}