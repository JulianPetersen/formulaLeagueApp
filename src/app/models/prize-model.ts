import { User } from "./user";

export interface PrizeModel {
    _id: string,
    amount: string,
    endDate: Date,
    status: string,
    participants: [{
        user:User;
        cantPoints:number
    }],

}
