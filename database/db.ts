interface DB {
    [key: string]: {
        name: string,
        players: string[]
    }
}
const tempDB: DB = {};

// tempDB stores rooms as room codes, each room stores a list of player UUIDs and the name of the room (default to room code)

function createRoom(code: string, name: string): void {
    tempDB[code] = {
        players: [],
        name: name
    };
}

function deleteRoom(code: string): void {
    delete tempDB[code];
}

function addPlayer(code: string, uuid: string): void {
    tempDB[code].players.push(uuid);
}

function removePlayer(code: string, uuid: string): void {
    tempDB[code].players = tempDB[code].players.filter(player => player !== uuid);
}

function getName(code: string): string | null {
    if (tempDB[code]) {
        return tempDB[code].name;
    }
    return null;
}

function getPlayers(code: string): string[] | null {
    if (tempDB[code]) {
        return tempDB[code].players;
    }
    return null;
}

export { createRoom, deleteRoom, addPlayer, removePlayer, getName, getPlayers };