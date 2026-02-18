import { TeamsModel } from "./teams-model"

export interface PilotsModel {
    _id: string
    name: string,
    number: number
    team: TeamsModel,
    country: string,
    img: string
}
