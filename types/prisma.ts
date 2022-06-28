type Room = {
    id: string,
    name: string,
    code: string,
    players: String[]
    playerCount: number // not in use currently
    createdAt: Date,
    updatedAt: Date,
}
// type Player = {
//     id: string,
//     uuid: string,
//     name: string, // no names yet
//     Room?: Room
//     roomId: string | null
//     createdAt: Date,
//     updatedAt: Date
// }

export type { Room }