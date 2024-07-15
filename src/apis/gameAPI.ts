import {RandomUUIDOptions} from "crypto";

const apiURL = "  https://batallanaval-hmk1.onrender.com/gameroom"

class GameAPI {

    postGame(user: string) : Promise<any> {

        return fetch(`${apiURL}?userId=${user}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then(r => (r.json()))
    }

    getOpponent(gameRoomid: string, userId: string): Promise<any> {

        return fetch(`${apiURL}/getOpponent?gameRoomId=${gameRoomid as RandomUUIDOptions}&userId=${userId}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then(r => r.json())

    }

}

export const gameAPI = new GameAPI()
