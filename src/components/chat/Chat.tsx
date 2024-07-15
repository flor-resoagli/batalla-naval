import './Chat.css'
import React, {ChangeEvent, useEffect, useState} from "react";


interface ChatProps {
    messages: {message: string, user: string}[]
    userId: string
    sendMessage: (message: string) => void
    userName: string | undefined,
    opponentName: string | undefined
}


const Chat = (props: ChatProps) => {

    useEffect(() => {
        console.log(props.messages)
    })

    const [message, setMessage] = useState('')

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value)
    }

    const clearMessage = () => {
        setMessage('')
    }

    return (
        <div className={'chat-container'}>
            <div className="chat-box">
                <div className="chat-content">
                    <ul className="chat-messages">
                        {props.messages.map(chat=>(
                            <div className={`message-container ${chat.user === props.userId && "self"}`}>
                                <li className={`message ${chat.user === props.userId && "self"}`}  >
                                    {chat.user !== props.userId && <div className="avatar">{props.opponentName ? props.opponentName : "Opponent"}</div>}
                                    {chat.user === props.userId && <div className="avatar self">{props.userName ? props.userName : "Me"}</div>}
                                    <div className="message-data">{chat.message}</div>
                                </li>
                            </div>

                        ))}
                    </ul>

                    <div className="send-message">
                        <input type="text" className="input-message" placeholder="Enter the message" value= {message} onChange={(event) => handleMessageChange(event)}/>
                        <button type="button" className="send-button" onClick={() => {
                            props.sendMessage(message)
                            clearMessage()
                        }} >send</button>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default Chat