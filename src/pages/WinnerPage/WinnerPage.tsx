import './WinnerPage.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function WinnerPage() {

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
            setPlayer(p)
        }
    }, [])


    return (
        <div>
            <h3>Ganaste!</h3>
            <div className={'stats-container'}>
                <div className={'stat-container'}>
                    Partidas jugadas: {player?.gamesPlayed}
                </div>
                <div className={'stat-container'}>
                    Partidas ganadas: {player?.gamesWon}
                </div>
            </div>

            <div className={'button-container'}>
                <button onClick={() => { // @ts-ignore
                    navigate("/home")}}>Inicio</button>

            </div>
        </div>
    )
}

export default WinnerPage