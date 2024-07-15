import './Game.css'
import React, { useEffect, useState} from "react";
import {Snackbar} from "@mui/material";
import Loading from "../loading/Loading";

interface GameProps {
    positions: {id: string, x: number, y: number}[]
    shotsOwn: { x: number, y: number, hit: boolean}[]
    shotsOpponent: {x: number, y: number, hit: boolean}[]
    ownTurn: boolean
    onShoot: (squareId: string) => void
    // onFeedbackReceived: () => {}
}


const Game = (props: GameProps) => {

    const userSquares: HTMLDivElement[] = []
    const opponentSquares: HTMLDivElement[] = []

    const [load, setLoad] = useState(true)

    useEffect(() => {
        if( props.positions){
            // console.log(props.positions)
            // renderUserBoard()
            // renderOpponentBoard()
            renderShips()
            // setLoad(false)
        }
    }, [])

    useEffect(() => {

        renderOwnShots()
        renderOpponentShots()
    }, [props])

    useEffect(() => {

        // console.log(document.querySelectorAll('.opponent-square'))

        if(!props.ownTurn) {
            document.querySelector('.opponent-board')?.classList.add('unavailable')

            document.querySelectorAll('.opponent-square').forEach(s => {
                // console.log(s.classList)
                s.classList.add('unavailable')
            })

            // opponentSquares.forEach(s => {
            //     s.classList.add('unavailable')
            // })
        }else{
            document.querySelector('.opponent-board')?.classList.remove('unavailable')
            document.querySelectorAll('.opponent-square').forEach(s => {
                // console.log(s.classList)
                s.classList.add('unavailable')
            })
            // opponentSquares.forEach(s => {
            //     s.classList.remove('unavailable')
            // })
        }
    })

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

        if( props.positions !== undefined ) {
            props.positions.forEach(p => {
                const x = p.x
                const y = p.y

                const index = y*10 + x
                // console.log(index)
                // console.log(x)
                // console.log(y)
                document.querySelectorAll('.user-square').forEach(s => {
                    if(s.id === String(index)){
                        s.classList.add('taken')
                    }
                })
                // document.querySelector('#'+index)
                // userSquares[index].classList.add('taken')
            })
        }

    }

    function renderOwnShots() {
        props.shotsOwn.forEach(s => {
            const x = s.x
            const y = s.y

            const index = y*10 + x

            document.querySelectorAll('.opponent-square').forEach(sq => {
                if(sq.id === String(index)){
                    sq.classList.add(s.hit ? 'boom' : 'miss')
                }
            })
            // document.querySelector('.opponent-square #'+index)?.classList.add( s.hit ? 'boom' : 'miss')

            // opponentSquares[index].classList.add( s.hit ? 'boom' : 'miss')

        })
    }

    function renderOpponentShots() {
        props.shotsOpponent.forEach(s => {
            const x = s.x
            const y = s.y

            const index = y*10 + x

            document.querySelectorAll('.user-square').forEach(sq => {
                if(sq.id === String(index)){
                    sq.classList.add(s.hit ? 'boom' : 'miss')
                }
            })

            // document.querySelector('.user-square #'+index)?.classList.add( s.hit ? 'boom' : 'miss')

            // userSquares[index].classList.add( s.hit ? 'boom' : 'miss')

        })
    }

    function handleSquareClick(e: EventTarget) {
        // console.log(e.dataset.id)
        // console.log(props.ownTurn)
        // @ts-ignore
        console.log(e.id)
        if(props.ownTurn) {
            // @ts-ignore
            props.onShoot(e.id)
        }else{
            handleShowError()
        }
    }

    const nums = [0,1,2,3,4,5,6,7,8,9]

    const handleAutoPlay = () => {
        // @ts-ignore
        console.log("Autoshoot!");
        if(props.ownTurn) {
            const randomX = nums[Math.floor(Math.random() * nums.length)];
            const randomY = nums[Math.floor(Math.random() * nums.length)];
            const randomIndex = randomX * nums.length + randomY;
            props.onShoot(String(randomIndex))
        }else{
            handleShowError()
        }
    }

    const [openError, setOpenError] = useState(false)
    function handleShowError() {
        // console.log(props.ownTurn)
        setOpenError(true)
        setTimeout(() => {
            setOpenError(false)
        }, 1000)
    }

    if(props.positions === undefined) {

        return <Loading />

    }


    return (
        <div className={'game-container'}>
            <h1> Battleships </h1>
            <div className={'board-container'}>

                <div className={'user-board'}>
                    {
                        nums.flatMap(i => {
                            return nums.map(j => {
                                const index = i*10 + j
                                // const square: HTMLDivElement = document.createElement('div')
                                // square.dataset.id = String(i)
                                // userSquares.push(square)
                                return <div id={String(index)} className={'user-square'}></div>
                            })
                        })
                    }
                </div>


                <div className={'opponent-board'} onClick={(event) => {
                    // console.log(event.target)
                    // handleSquareClick(event.target)
                }}>
                    {
                        nums.flatMap(i => {
                            return nums.map(j => {
                                const index = i*10 + j
                                // const square: HTMLDivElement = document.createElement('div')
                                // square.dataset.id = String(i)
                                // userSquares.push(square)
                                return <div id={String(index)} className={'opponent-square'} onClick={(event) => {
                                    console.log(event.target)
                                    handleSquareClick(event.target)}
                                }></div>
                            })
                        })
                    }
                </div>


            </div>
                {props.ownTurn ? (
                    <>
                    <h3 className={'turn'}>It's your turn!</h3>
                    <button onClick={handleAutoPlay} >Auto Play</button>
                    </>
                ):(
                    <h3 className={'turn'}>Waiting for opponent...</h3>
                )}


            <Snackbar
                anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
                open={openError}
                message="Wait your turn to attack!"/>

        </div>
    )

}

export default Game