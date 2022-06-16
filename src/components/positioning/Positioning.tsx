import './Positioning.css'
import React, {useEffect, useState} from "react";


function Positioning () {

    //LOAD BOARD

    const squares: HTMLDivElement[] = []
    const ships: NodeListOf<HTMLDivElement> = document.querySelectorAll('.ship')
    const [load, setLoad] = useState(true)

    useEffect(() => {

        if(load) {
            renderSquares()
            setLoad(false)
            ships.forEach(s => {
                s.addEventListener('dragstart', dragStart)
                // s.ondragstart = (event) => dragStart(event)
            })
        }

    }, [])

    function renderSquares() {

        const grid = document.querySelector(".user-board")
        let i = 0

        while (squares.length < 100) {

            const square = document.createElement('div')
            square.dataset.id = String(i)

            square.ondragstart = (event) => {dragStart(event)}
            square.ondragover = (event) => {event.preventDefault()}
            square.ondragenter = (event) => {event.preventDefault()}
            square.ondragleave = (event) => {event.preventDefault()}
            square.ondrop = (event) => {handleDrop(event)}
            square.ondragend = (event) => {event.preventDefault()}
            grid?.appendChild(square)
            squares.push(square)
            i++

        }

    }

    //SHIP ROTATION

    const [horizontal, setHorizontal] = useState(true)

    function rotateShips() {

        ships.forEach( (s) => {
            s.classList.toggle(s.className.split(" ")[1] + '-vertical')
            setHorizontal(!horizontal)
        })

    }

    //SHIP DRAG&DROP

    const [selectedShipAndIndex, setSelectedShipAndIndex] = useState('')

    const handleClickShip = (event: React.MouseEvent<HTMLDivElement>) => {
        // @ts-ignore
        setSelectedShipAndIndex(event.target.id)
    }

    const [draggedShip, setDraggedShip] = useState('')
    const [draggedShipLength, setDraggedShipLength] = useState(0)

    function dragStart(event: DragEvent) {

        console.log(event)

        // @ts-ignore
        setDraggedShipLength(event.target.childNodes.length)
        // @ts-ignore
        setDraggedShip("."+event.target.className.split(' ')[1])
        console.log(document.querySelector(draggedShip))
        console.log(draggedShip)
    }

    function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
        console.log(event)

        // @ts-ignore
        setDraggedShipLength(event.target.childNodes.length)
        // @ts-ignore
        setDraggedShip("."+event.target.className.split(' ')[1])
        console.log(document.querySelector(draggedShip))
        console.log(draggedShip)
    }

    function handleDrop (event: DragEvent) {
        // console.log(document.querySelector(draggedShip))

        console.log(draggedShip)

        // // @ts-ignore
        // let shipNameWithLastId = document.querySelector(draggedShip).lastChild.id
        // let shipClass = shipNameWithLastId.slice(0, -2)
        //
        // let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
        // // @ts-ignore
        // let shipLastId = lastShipIndex + parseInt(event.target.dataset.id)
        //
        // let selectedShipIndex = parseInt(selectedShipAndIndex.substr(-1))
        //
        // shipLastId = shipLastId - selectedShipIndex
        //
        // let directionClass = ''
        //
        // for(let i = 0; i < draggedShipLength; i++) {
        //
        //     if(i === 0) directionClass = 'start'
        //     else if( i === draggedShipLength - 1) directionClass = 'end'
        //
        //     // @ts-ignore
        //     const id = parseInt(event.target.dataset.id) - selectedShipIndex + i
        //
        //     squares[id].classList.add('taken', horizontal ? 'horizontal' : 'vertical', directionClass, shipClass)
        //
        // }
        //
        // // @ts-ignore
        // document.querySelector('.display-grid').removeChild(draggedShip)

    }


    return (
        <div className={'container'}>

            <div className={'board-container'}>
                <div className={'user-board'}></div>
            </div>

            <button className={'rotate-btn'} onClick={rotateShips}> Rotar </button>

            <div className="board-container">
                <div className="grid-display">
                    <div className="ship destroyer-container" draggable="true"
                        onDragStart={(event) => handleDragStart(event)}
                        onMouseDown={(event) => handleClickShip(event)}>
                        <div id="destroyer-0"></div>
                        <div id="destroyer-1"></div>

                    </div>

                    <div className="ship submarine-container" draggable="true"
                         onMouseDown={(event) => handleClickShip(event)}>

                        <div id="submarine-0"></div>
                        <div id="submarine-1"></div>
                        <div id="submarine-2"></div>

                    </div>

                    <div className="ship cruiser-container" draggable="true"
                         onMouseDown={(event) => handleClickShip(event)}>

                        <div id="cruiser-0"></div>
                        <div id="cruiser-1"></div>
                        <div id="cruiser-2"></div>

                    </div>

                    <div className="ship battleship-container" draggable="true"
                         onMouseDown={(event) => handleClickShip(event)}>

                        <div id="battleship-0"></div>
                        <div id="battleship-1"></div>
                        <div id="battleship-2"></div>
                        <div id="battleship-3"></div>

                    </div>

                    <div className="ship carrier-container" draggable="true"
                         onMouseDown={(event) => handleClickShip(event)}>


                        <div id="carrier-0"></div>
                        <div id="carrier-1"></div>
                        <div id="carrier-2"></div>
                        <div id="carrier-3"></div>
                        <div id="carrier-4"></div>

                    </div>
                </div>
            </div>

        </div>
    )

}

export default Positioning