
const apiURL = " https://battleshiips.herokuapp.com/player"

class UserAPI {

    postUserToken( user: string ) : Promise<any> {

        return fetch(`${apiURL}?token=${user}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then(r => (r.json()))

    }

    getUser( user: string ) : Promise<any> {

        return fetch(`${apiURL}/${user}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then(r => (r.json()))

    }

}

export const userAPI = new UserAPI( )