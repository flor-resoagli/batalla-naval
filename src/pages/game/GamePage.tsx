import './GamePage.css'
import {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {useParams} from "react-router-dom";
import {RandomUUIDOptions} from "crypto";
import Waiting from "../../components/waiting/Waiting";
import Positioning from "../../components/positioning/Positioning";
import Standby from "../../components/standby/Standby";
import Game from "../../components/game/Game";

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

    // @ts-ignore
    const userID = JSON.parse(sessionStorage.getItem("player")).id
    const gameID = useParams().gameID
    const [gameState, setGameState] = useState("WAITING")

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
    const [ownShots, setOwnShots] = useState<{id: string, x: number, y: number}[]>([])
    const [opponentShots, setOpponentShots] = useState<{id: string, x: number, y: number}[]>([])
    const [ownTurn, setOwnTurn] = useState(false)

    function onMessageReceived(payload: { body: string; }) {

        // console.log('payload: ' + payload)
        // console.log('body: ' + payload.body)

        const payloadData = JSON.parse(payload.body);
        console.log(payloadData)
        setGameState(payloadData.status)
        switch (payloadData.status) {

            case "READY":
                console.log(payloadData.positionsPlayer)
                setPositions(payloadData.positionsPlayer)
                setOwnShots(payloadData.shotsPlayer1)
                setOpponentShots(payloadData.shotsPlayer2)
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

                    case "GAME_LOAD":
                        console.log(payloadData.positionsPlayer)
                        setPositions(payloadData.positionsPlayer)
                        setOwnShots(payloadData.shotsPlayer1)
                        setOpponentShots(payloadData.shotsPlayer2)
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
                stompClient.subscribe('/user/'+userID+'/private', onPrivateMessage);
            }
            userJoin();
        }, 500)
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


    switch (gameState) {

        case "WAITING":
            return (
                // <Positioning onConfirm={onPositioningOver}/>
                <Waiting gameID={gameID?gameID:""}/>
            )
        case "POSITIONING":
            return (
                <Positioning onConfirm={onPositioningOver}/>
            )
        case "STANDBY":
            return (
                <Standby />
            )
        case "READY" || "GAME_LOAD" || "YOUR_TURN" || "OPPONENT_TURN":
            return (
                <Game positions={positions} ownTurn={ownTurn} shotsOwn={ownShots} shotsOpponent={opponentShots} />
            )
        // case "YOUR_TURN":
        //     return (
        //         <div>
        //             <h3>Your turn</h3>
        //         </div>
        //     )
        // case "OPPONENT_TURN":
        //     return (
        //         <div>
        //             <h3>Wait</h3>
        //         </div>
        //     )
        case "GAME_OVER":
            return (
                <div>
                    <h3>Starting the game</h3>
                </div>
            )
        default:
            return (
                <div>

                </div>
            )
    }

}

export default GamePage