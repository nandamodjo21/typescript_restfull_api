export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    kdUser: string;
    name:string;
    username:string;
    email:string;
    active:string;
    createdAt:Date;
}

export  function toLoginResponse(user: any): LoginResponse {
    return {
        kdUser:user.kd_user,
        name:user.name,
        username:user.username,
        email:user.email,
        active:user.active,
        createdAt:user.created_at
    }
}