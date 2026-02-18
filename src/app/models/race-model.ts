import { PilotsModel } from "./pilots-model";
import { TracksModel } from "./tracks-model";

export interface RaceModel {
        _id:string

    name: string,
    circuit: TracksModel,
    date: Date,
    pilots: PilotsModel[],
    cutoff: Date,
    status: string,
    result: [],
}
