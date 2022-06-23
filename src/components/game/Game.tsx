import './Game.css'
import React, {useEffect, useState} from "react";

interface GameProps {
    positions: {id: string, x: number, y: number}[]
    shotsOwn: {id: string, x: number, y: number}[]
    shotsOpponent: {id: string, x: number, y: number}[]
    ownTurn: boolean
    // onShoot: () => {}
    // onFeedbackReceived: () => {}
}


const Game = (props: GameProps) => {

    const userSquares: HTMLDivElement[] = []
    const opponentSquares = []

    const [load, setLoad] = useState(true)

    useEffect(() => {
        if(load){
            console.log(props.positions)
            renderUserBoard()
            renderOpponentBoard()
            // renderShips()
            //renderShots()
            setLoad(false)
        }
    }, [])

    function renderUserBoard() {
        const grid = document.querySelector('.user-board')
        let i = 0

            while (userSquares.length < 100) {

                const square = document.createElement('div')
                square.dataset.id = String(i)
                grid?.appendChild(square)
                userSquares.push(square)
                i++

            }
    }

    function renderOpponentBoard() {
        const grid = document.querySelector('.opponent-board')
        let i = 0

        while (opponentSquares.length < 100) {

            const square = document.createElement('div')
            square.dataset.id = String(i)
            grid?.appendChild(square)
            opponentSquares.push(square)
            i++

        }
    }

    function renderShips() {

        props.positions.forEach(p => {
            const x = p.x
            const y = p.y

            const index = y*10 + x

            userSquares[index].classList.add('.taken')
        })

    }

    // function renderSquares() {
    //
    //     const grid = document.querySelector(".user-board")
    //     let i = 0
    //
    //     while (squares.length < 100) {
    //
    //         const square = document.createElement('div')
    //         square.dataset.id = String(i)
    //         square.ondragstart = handleDragStart
    //         square.ondragover = enableDropping
    //         square.ondragenter = enableDropping
    //         square.ondrop = handleDrop
    //         grid?.appendChild(square)
    //         squares.push(square)
    //         i++
    //
    //     }
    //
    // }


    return (
        <div className={'container'}>

            <div className={'board-container'}>
                <div className={'user-board'}></div>
                <div className={'opponent-board'}></div>

            </div>
        </div>
    )

}

export default Game