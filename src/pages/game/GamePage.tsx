import './GamePage.css'
import {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {useParams} from "react-router-dom";
import {RandomUUIDOptions} from "crypto";
import Waiting from "../../components/waiting/Waiting";
import Positioning from "../../components/positioning/Positioning";

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
        console.log(gameID)
        if(onLoad){
           connect()
            setOnLoad(false)
        }
    })

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

    function onMessageReceived(payload: { body: string; }) {
        const payloadData = JSON.parse(payload.body);
        setGameState(payloadData.status)
        switch (payloadData.status) {

            default: break
        }
    }

    function onPrivateMessage(payload: { body: string; }) {
        console.log(payload.body)
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


    switch (gameState) {

        case "WAITING":
            return (
                <Positioning/>
                // <Waiting gameID={gameID?gameID:""}/>
            )
        case "POSITIONING":
            return (
                <Positioning/>
            )
        case "STANDBY":
            return (
                <div>
                    <h3>Waiting for other player to finish positioning...</h3>
                </div>
            )
        case "READY":
            return (
                <div>
                    <h3>Starting the game</h3>
                </div>
            )
        case "YOUR_TURN":
            return (
                <div>
                    <h3>Your turn</h3>
                </div>
            )
        case "OPPONENT_TURN":
            return (
                <div>
                    <h3>Wait</h3>
                </div>
            )
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