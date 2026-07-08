export interface User {
        id: string,
        name: string,
        email: string,
        role: string,
        points:number,
        username?:string
        verified?:boolean
        credits?:number
}

export interface UserRankingPosition {
        position: number,
        points: number,
        totalUsers: number,
        username?: string,
        email?: string
}
