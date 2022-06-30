import './Chat.css'
import React, {ChangeEvent, ChangeEventHandler, useEffect, useState} from "react";


interface ChatProps {
    messages: {message: string, user: string}[]
    userId: string
    sendMessage: (message: string) => void
}


const Chat = (props: ChatProps) => {

    useEffect(() => {
        console.log(props.messages)
    })

    const [message, setMessage] = useState('')

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value)
    }

    return (
        <div className={'chat-container'}>
            <div className="chat-box">
                <div className="chat-content">
                    <ul className="chat-messages">
                        {props.messages.map(chat=>(
                            <li className={`message ${chat.user === props.userId && "self"}`}  >
                                {chat.user !== props.userId && <div className="avatar">Oponente</div>}
                                {chat.user === props.userId && <div className="avatar self">Yo</div>}
                                <div className="message-data">{chat.message}</div>
                            </li>
                        ))}
                    </ul>

                    <div className="send-message">
                        <input type="text" className="input-message" placeholder="enter the message" onChange={(event) => handleMessageChange(event)}/>
                        <button type="button" className="send-button" onClick={() => {props.sendMessage(message)}} >send</button>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default Chat