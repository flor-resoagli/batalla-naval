import './WaitingRoomPage.css'
import {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {over} from "stompjs";

let stompClient: {
    connect: (arg0: {}, arg1: () => void, arg2: (err: any) => void) => void;
    subscribe: (arg0: string, arg1: { (payload: any): void; (payload: any): void; }) => void;
    send: (arg0: string, arg1: {}, arg2: string) => void;
} | null = null;

function WaitingRoomPage() {

    // @ts-ignore
    const userID = JSON.parse(sessionStorage.getItem("player")).id

    const [onLoad, setOnLoad] = useState(true)
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        if(onLoad){
            connect()
            setOnLoad(false)
        }
    })

    const connect = () =>{
        let Sock = new SockJS('http://localhost:8080/battleship');
        stompClient = over(Sock);
        if(stompClient){
            stompClient.connect({},onConnected, onError);
        }
    }

    function onError() {
        console.log("error")
    }

    function onMessageReceived() {

    }

    function onPrivateMessage() {

    }

    function userJoin() {

    }

    const onConnected = () => {
        // setTimeout(() => {
        //     setConnected(true)
        //     if(stompClient){
        //         stompClient.subscribe('/chatroom', onMessageReceived);
        //     }
        //     userJoin();
        // }, 500)

    }


    return (
        <div>
            <h3>Waiting for another player...</h3>
        </div>
    )
}

export default WaitingRoomPage