import './GamePage.css'
import {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {useParams} from "react-router-dom";

let stompClient: {
    connect: (arg0: {}, arg1: () => void, arg2: (err: any) => void) => void;
    subscribe: (arg0: string, arg1: { (payload: any): void; (payload: any): void; }) => void;
    send: (arg0: string, arg1: {}, arg2: string) => void;
} | null = null;

interface GamePageProps {
    gameID: string
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

    function onMessageReceived() {

    }

    function onPrivateMessage() {

    }

    function userJoin() {

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
                <div>
                    <h3>Waiting for game</h3>
                </div>
            )
        case "POSITIONING":
            return (
                <div>
                    <h3>In positioning</h3>
                </div>
            )
        default:
            return (
                <div> Default page </div>
            )
    }

}

export default GamePage