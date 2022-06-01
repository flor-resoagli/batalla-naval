import "./HomePage.css"
import {useEffect, useState} from "react";

function HomePage() {
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
            setPlayer(p)
        }
    }, [])

    return (
        <div className={'container'}>
            <div className={'title-container'}>
                <h1 >Batalla Naval</h1>
            </div>
            <div className={'content-container'}>
                <h3> Bienvenido {player?.name}!</h3>
                <div className={'stats-container'}>
                    <div className={'stat-container'}>
                        Partidas jugadas: {player?.gamesPlayed}
                    </div>
                    <div className={'stat-container'}>
                        Partidas ganadas: {player?.gamesWon}
                    </div>
                </div>
                <div className={'button-container'}>
                    <button>Juego Privado</button>
                    <button>Juego Publico</button>
                </div>
            </div>
        </div>
    )
}

export default HomePage;