import "./HomePage.css"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {userAPI} from "../../apis/userAPI";

function HomePage() {
    const navigate = useNavigate()

    const [player, setPlayer] = useState<{
        email: string,
        gamesPlayed: number,
        gamesWon: number,
        id: string,
        name: string,
        profilePicture: string
    }>()

    useEffect(() => {
        const session = sessionStorage.getItem("player")
        if(session) {
            const p = JSON.parse(session)
            userAPI.getUser(p.id).then(r => setPlayer(r))
        }
    }, [])

    return (
        <div className={'page-container'}>
            <div className={'body-container'}>
                <div className={'title-container'}>
                    <h1> Battleships </h1>
                </div>
                <div >
                    <h3> Welcome {player?.name}!</h3>
                    <div className={'stats-container'}>
                        <div className={'stat-container'}>
                            Games played: {player?.gamesPlayed}
                        </div>
                        <div className={'stat-container'}>
                            Games won: {player?.gamesWon}
                        </div>
                    </div>
                    <div className={'button-container'}>
                        <button className={'start-button'} onClick={() => { // @ts-ignore
                            navigate("/newGame")}}>Start</button>
                        {/*<button>Juego Publico</button>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;