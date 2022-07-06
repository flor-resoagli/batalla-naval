import './GamePage.css'
import {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {useNavigate, useParams} from "react-router-dom";
import {RandomUUIDOptions} from "crypto";
import Waiting from "../../components/waiting/Waiting";
import Positioning from "../../components/positioning/Positioning";
import Standby from "../../components/standby/Standby";
import Game from "../../components/game/Game";
import Loading from "../../components/loading/Loading";
import game from "../../components/game/Game";
import Chat from "../../components/chat/Chat";

let stompClient: {
    connect: (arg0: {}, arg1: () => void, arg2: (err: any) => void) => void;
    subscribe: (arg0: string, arg1: { (payload: any): void; (payload: any): void; }) => void;
    send: (arg0: string, arg1: {}, arg2: string) => void;
} | null = null;

interface GamePageProps {
    gameID: string
}

export type Shot = {
    x: number
    y: number
    hit: boolean
}

function GamePage () {

    const navigate = useNavigate()

    // @ts-ignore
    const userID = JSON.parse(sessionStorage.getItem("player")).id
    const gameID = useParams().gameID
    const [gameState, setGameState] = useState("LOADING")

    const [onLoad, setOnLoad] = useState(true)
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        // console.log(gameID)
        if(onLoad){
            setOnLoad(false)
            connect()

        }
    }, [])

    function onError() {
        console.log("error")
    }

    const connect = () =>{
        let Sock = new SockJS('http://localhost:8080/battleship');
        stompClient = over(Sock);
        if(stompClient){
            stompClient.connect({},onConnected, onError);
        }
    }

    const [positions, setPositions] = useState<{id: string, x: number, y: number}[]>([])
    const [ownShots, setOwnShots] = useState<{ x: number, y: number, hit: boolean}[]>([])
    const [opponentShots, setOpponentShots] = useState<{x: number, y: number, hit: boolean}[]>([])
    const [ownTurn, setOwnTurn] = useState(false)
    const [playerWon, setPlayerWon] = useState(false)

    function onMessageReceived(payload: { body: string; }) {

        // console.log('payload: ' + payload)
        // console.log('body: ' + payload.body)

        const payloadData = JSON.parse(payload.body);
        // console.log(payloadData)
        setGameState(payloadData.status)
        switch (payloadData.status) {

            case "FEEDBACK":
                if(payloadData.shooterId === userID){
                    ownShots.push({
                        x: payloadData.x,
                        y: payloadData.y,
                        hit: payloadData.hit
                    })
                    setOwnShots([...ownShots])

                }else{
                    opponentShots.push({
                        x: payloadData.x,
                        y: payloadData.y,
                        hit: payloadData.hit
                    })
                    setOpponentShots([...opponentShots])
                }
                break

            case "GAME_OVER":
                setPlayerWon(payloadData.winnerId === userID)
                break

            default: break

        }
    }

    function onPrivateMessage(payload: { body: string; }) {
        // console.log('payload: ' + payload)
        // console.log('body: ' + payload.body)

        const payloadData = JSON.parse(payload.body);
        setGameState(payloadData.status)
        switch (payloadData.status) {

            case "YOUR_TURN":
                if(payloadData.positionsPlayer1){
                    setPositions(payloadData.positionsPlayer1)
                    setOwnShots(payloadData.shotsPlayer1)
                    setOpponentShots(payloadData.shotsPlayer2)
                }
                setOwnTurn(true)
                break

            case "OPPONENT_TURN":
                if(payloadData.positionsPlayer1){
                    setPositions(payloadData.positionsPlayer1)
                    setOwnShots(payloadData.shotsPlayer1)
                    setOpponentShots(payloadData.shotsPlayer2)
                }
                setOwnTurn(false)
                break

            default: break
        }
    }

    function userJoin() {
        var joinMessage = {
            gameRoomId: gameID as RandomUUIDOptions,
            userId: userID
        }
        if(stompClient) {
            stompClient.send("/app/join", {}, JSON.stringify(joinMessage))
        }
    }

    const onConnected = () => {
        setTimeout(() => {
            setConnected(true)
            if(stompClient){
                stompClient.subscribe('/game/'+gameID+'/private', onMessageReceived);
                stompClient.subscribe('/game/'+gameID+'/message', onChatReceived)
                stompClient.subscribe('/user/'+userID+'/private', onPrivateMessage);
            }
            userJoin();
        }, 500)
    }

    const [messages, setMessages] = useState<{message: string, user: string}[]>([])
    var receive = true

    const onChatReceived = (payload: { body: string; }) => {

        const payloadData = JSON.parse(payload.body);

        const message = {
            message: payloadData.message,
            user: payloadData.userId
        }

        if(receive){
            messages.push(message)
            console.log(message)
            setMessages([...messages])
        }

        receive = !receive

    }

    const onPositioningOver = (positions: [[]]) => {

        var positionMessage = {
            gameRoomId: gameID as RandomUUIDOptions,
            userId: userID,
            positions: positions
        }
        if(stompClient) {
            stompClient.send("/app/board", {}, JSON.stringify(positionMessage))
        }
    }

    const onShoot = (squareId: string) => {
        const id = parseInt(squareId)

        const x = id%10
        const y = Math.floor(id/10)

        var shootMessage = {
            gameRoomId: gameID as RandomUUIDOptions,
            shooterId: userID,
            x: x,
            y: y
        }

        if(stompClient) {
            stompClient.send("/app/shoot", {}, JSON.stringify(shootMessage))
        }
    }

    const randomizePositions = () => {

        var randomPositionMessage = {
            gameRoomId: gameID as RandomUUIDOptions,
            userId: userID
        }

        if(stompClient) {
            stompClient.send("/app/randomBoard", {}, JSON.stringify(randomPositionMessage))
        }
    }

    const handleBackToHome = () => {
        navigate("/home")
    }

    const handleSendMessage = (message: string) => {

        var chatMessage = {
            gameRoomId: gameID as RandomUUIDOptions,
            userId: userID,
            message: message
        }

        if(stompClient) {
            stompClient.send("/app/chatMessage", {}, JSON.stringify(chatMessage))
        }

    }


    switch (gameState) {

        case "WAITING":
            return (
                <div className={'other-background'}>
                    <Waiting gameID={gameID?gameID:""}/>
                </div>
            )
        case "POSITIONING":
            return (
                <div className={'other-background'}>
                    <Positioning onConfirm={onPositioningOver} onRandom={randomizePositions}/>
                </div>
            )
        case "STANDBY":
            return (
                <div className={'other-background'}>
                    <Standby />
                </div>
            )
        case "GAME_LOAD":
            return (
                <div className={'other-background'}>
                    <Loading/>
                </div>
            )

        case "READY":
        case "FEEDBACK":
        case"YOUR_TURN":
        case "OPPONENT_TURN":
            if( positions && ownShots && opponentShots) {
                return (
                    <div className={'other-background'}>
                        <Game positions={positions} ownTurn={ownTurn} shotsOwn={ownShots} shotsOpponent={opponentShots} onShoot={onShoot}/>
                        <Chat messages={messages} userId={userID} sendMessage={handleSendMessage}/>
                    </div>
                )
            }else{
                return (
                    <div className={'other-background'}>
                        <Loading />
                    </div>
                )
            }


        case "GAME_OVER":
            return (
                <div className={'other-background'}>
                    <div className={'container'}>
                        <h1>Game Over!</h1>
                        {playerWon ? (
                            <div>
                                {/*<h3> nice. </h3>*/}
                                <div className={'winner-image'}> </div>
                            </div>
                        ):(
                            <div>
                                <div className={'loser-image'}> </div>
                            </div>
                        )}
                        <button onClick={handleBackToHome}> Play again </button>
                    </div>
                </div>
            )
        default:
            return (
                <div className={'other-background'}>
                    <Loading/>
                </div>

            )
    }

}

export default GamePage