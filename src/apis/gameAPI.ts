
const apiURL = " https://batallanaval-hmk1.onrender.com/gameroom"

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

}

export const gameAPI = new GameAPI()