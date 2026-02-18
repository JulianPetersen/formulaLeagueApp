import { User } from "./user";


export interface loguinResponse {
    message: string,
    token: string,
    user:User
}
