import "./newGamePage.css"
import {useState} from "react";
import {gameAPI} from "../../apis/gameAPI";
import {useNavigate} from "react-router-dom";

function NewGamePage() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const handleNewGame = () => {
        setLoading(true)
        // @ts-ignore
        const userID = JSON.parse(sessionStorage.getItem("player")).id

        return gameAPI.postGame(userID).then(r => {
            navigate(`/game/${r}`)
            setLoading(false)
        })

    }

    return (
        <div className={'container'}>
            <div className={'title-container'}>
                <h1> Nuevo Juego  </h1>
            </div>
            {loading ? (
                <div>
                    <h3>Loading...</h3>
                </div>
            ):(
                <div className={'content-container'}>
                    <div className={'col-container'}>
                        <div className={'row-container'}>
                            <input placeholder={'Token'} className={'name-input'}/>
                            <button className={'sm-button'}> Unirse </button>
                        </div>
                        <button onClick={handleNewGame}>Crear Juego</button>
                    </div>
                </div>
            )}
        </div>
    )

}

export default NewGamePage