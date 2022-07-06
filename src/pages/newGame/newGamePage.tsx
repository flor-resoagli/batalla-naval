import "./newGamePage.css"
import {useState} from "react";
import {gameAPI} from "../../apis/gameAPI";
import {useNavigate} from "react-router-dom";
import {ArrowBack} from "@mui/icons-material";

function NewGamePage() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [privateGameToken, setPrivateGameToken] = useState("")

    const handleNewGame = () => {
        setLoading(true)
        // @ts-ignore
        const userID = JSON.parse(sessionStorage.getItem("player")).id

        return gameAPI.postGame(userID).then(r => {
            navigate(`/game/${r}`)
            setLoading(false)
        })
    }

    const handleJoinGame = () => {
        navigate(`/game/${privateGameToken}`)
    }

    return (
        <div className={'page-container'}>
            <div className={'body-container'}>
                <div className={'title-container'}>
                    <h1> New Game  </h1>
                </div>
                {loading ? (
                    <div>
                        <h3>Loading...</h3>
                    </div>
                ):(
                    <div className={'content-container'}>
                        <div className={'col-container'}>

                            <p>Join an existing game with a token... </p>
                            <div className={'row-container'}>
                                <input placeholder={'Token'} className={'token-input'}
                                       onChange={(e) => {setPrivateGameToken(e.target.value)}}/>
                                <button className={'sm-button'} onClick={handleJoinGame}> Join </button>
                            </div>
                            <p> ...or create a new game! </p>
                            <button className={'start-button'} onClick={handleNewGame}>Create</button>
                            <div className={'back-container'} onClick={() => navigate('/home')}> <ArrowBack/>   Back to home </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

}

export default NewGamePage