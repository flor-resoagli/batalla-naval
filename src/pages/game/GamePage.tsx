import './GamePage.css'
import React, {useEffect, useState} from "react";
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
import {ArrowBack, ArrowCircleLeft} from "@mui/icons-material";

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
        let Sock = new SockJS('https://batallanaval-hmk1.onrender.com/battleship');
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
                if(payloadData.hit) {
                    const sound: HTMLMediaElement | null= document.querySelector(".hit-audio")
                    if(sound){
                        sound.currentTime = 0
                        sound.play()
                        sound.addEventListener('timeupdate', function (){
                            if (sound.currentTime >= 2) {
                                sound.pause();
                            }
                        }, false);
                    }
                    sound?.play()

                }else{
                    const sound: HTMLMediaElement | null= document.querySelector(".miss-audio")
                    if(sound){
                        sound.currentTime = 2.5
                        sound.play()
                        sound.addEventListener('timeupdate', function (){
                            if (sound.currentTime >= 4) {
                                sound.pause();
                            }
                        }, false);
                    }
                    sound?.play()

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

    const handleExit = () => {

        var exitMessage = {
            gameRoomId: gameID as RandomUUIDOptions,
            exitedPlayerId: userID
        }

        if(stompClient) {
            stompClient.send("/app/endGame", {}, JSON.stringify(exitMessage))
        }

        navigate("/home")
    }


    switch (gameState) {

        case "WAITING":
            return (
                <div className={'other-background'}>
                    <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
                    <Waiting gameID={gameID?gameID:""}/>
                </div>
            )
        case "POSITIONING":
            return (
                <div className={'other-background'}>
                    <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
                    <Positioning onConfirm={onPositioningOver} onRandom={randomizePositions}/>
                </div>
            )
        case "STANDBY":
            return (
                <div className={'other-background'}>
                    <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
                    <Standby />
                </div>
            )
        case "GAME_LOAD":
            return (
                <div className={'other-background'}>
                    <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
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
                        <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
                        <div className={'row-page'}>
                            <Game positions={positions} ownTurn={ownTurn} shotsOwn={ownShots} shotsOpponent={opponentShots} onShoot={onShoot}/>
                            <Chat messages={messages} userId={userID} sendMessage={handleSendMessage}/>
                        </div>
                        <audio className={'miss-audio'}>
                            <source src={"https://cdn.pixabay.com/download/audio/2021/08/09/audio_0dcf482f2f.mp3?filename=jump-into-water-splash-sound-6999.mp3"}/>
                        </audio>
                        <audio className={'hit-audio'}>
                            <source src={"https://cdn.pixabay.com/download/audio/2021/12/20/audio_4890859f48.mp3?filename=hit-sound-effect-12445.mp3"}/>
                        </audio>
                    </div>
                )
            }else{
                return (
                    <div className={'other-background'}>
                        <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
                        <Loading />
                    </div>
                )
            }


        case "GAME_OVER":
            return (
                <div className={'other-background'}>
                    <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
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

        case "ERROR":
            return (
                <div className={'other-background'}>
                    <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
                    <div className={'waiting-page'}>
                        <h1> So sorry :( </h1>
                        <p> We couldn't find the game you're looking for, maybe try again later? </p>
                        <button className={'start-button'} onClick={() => {navigate("/home")}}> Back to home </button>
                    </div>
                </div>
            )

        case "GAME_ENDED":
            return (
                <div className={'other-background'}>
                    <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
                    <div className={'waiting-page'}>
                        <h1> So sorry :( </h1>
                        <p> Looks like your opponent abandonded the game, try making a new game! </p>
                        <button className={'start-button'} onClick={() => {navigate("/home")}}> Back to home </button>
                    </div>
                </div>
            )

        case "GAME_FULL":
            return (
                <div className={'other-background'}>
                    <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
                    <div className={'waiting-page'}>
                        <h1> Game is already full </h1>
                        <p> Try joining a different game, or create your own! </p>
                        <button className={'start-button'} onClick={() => {navigate("/home")}}> Back to home </button>
                    </div>
                </div>
            )

        default:
            return (
                <div className={'other-background'}>
                    <div className={'back-btn'} onClick={handleExit}> <ArrowCircleLeft  fontSize={'inherit'}/> Exit </div>
                    <Loading/>
                </div>

            )
    }

}

export default GamePage