import './Positioning.css'
import React, {useEffect, useState} from "react";

function Positioning ( {onConfirm, onRandom} ) {

    //LOAD BOARD

    const squares = []
    const ships = document.querySelectorAll('.ship')
    const [load, setLoad] = useState(true)

    const [isOver, setIsOver] = useState(false)

    useEffect(() => {

        if(load) {
            renderSquares()
            setLoad(false)
            sessionStorage.setItem("selectedShipId", '0')
            sessionStorage.setItem('isHorizontal', 'true')
        }

    }, [])

    function renderSquares() {

        const grid = document.querySelector(".user-board")
        let i = 0

        while (squares.length < 100) {

            const square = document.createElement('div')
            square.dataset.id = String(i)
            square.ondragstart = handleDragStart
            square.ondragover = enableDropping
            square.ondragenter = enableDropping
            square.ondrop = handleDrop
            grid?.appendChild(square)
            squares.push(square)
            i++

        }

    }

    const handleButtonClick = () => {

        if(isOver) {
            //handle confirm positions
            handleConfirmPositions()
        }else{
            rotateShips()
        }

    }

    //SHIP ROTATION

    let horizontal = true

    function rotateShips() {



        horizontal = !horizontal
        const h = sessionStorage.getItem('isHorizontal') === 'true'

        sessionStorage.setItem('isHorizontal',(!h).toString())

        ships.forEach( (s) => {

            s.classList.toggle(s.className.split(" ")[1] + '-vertical')

        })

    }

    //SHIP DRAG&DROP

    // const [selectedShipId, setSelectedShipId] = useState(0)

    const handleMouseDown = (event) => {

        sessionStorage.setItem('selectedShipId', (event.target.id.substr(-1)) )

        // setSelectedShipId(parseInt(event.target.id.substr(-1)))

        // console.log(selectedShipId)

    }

    const handleDragStart = (event) => {

        // console.log(document.querySelector("." + event.target.classList[1]))
        event.dataTransfer.setData('ship', "." + event.target.classList[1])

    }

    const enableDropping = (event) => {

        event.preventDefault()

    }

    const handleDrop = (event) => {

    //     console.log(event)
    //
        let draggedShip = document.querySelector(event.dataTransfer.getData('ship'))
        let draggedShipLength = draggedShip.children.length
    //
        let shipNameWithLastId = draggedShip.lastChild.id
        let shipClass = shipNameWithLastId.slice(0, -2)
    //     // console.log(shipClass)
    //
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
        let shipLastId =  lastShipIndex + parseInt(event.target.dataset.id)

        const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
        const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]

        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
        let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

        let selectedShipIndex = sessionStorage.getItem("selectedShipId")


        shipLastId = shipLastId - selectedShipIndex
        const isHorizontal = sessionStorage.getItem('isHorizontal') === 'true'

        if(!isHorizontal) selectedShipIndex = selectedShipIndex*10



        if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {

            for(let i=0; i < draggedShipLength; i++) {
                const index = parseInt(event.target.dataset.id) - selectedShipIndex + i
                if(squares[index].classList.contains('taken')) return
            }

            for (let i=0; i < draggedShipLength; i++) {
                const index = parseInt(event.target.dataset.id) - selectedShipIndex + i
                let directionClass
                // if (i === 0) directionClass = 'start'
                // if (i === draggedShipLength - 1) directionClass = 'end'
                squares[index].classList.add('taken', 'horizontal', directionClass, shipClass)
            }

        } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {

            for(let i=0; i < draggedShipLength; i++) {
                const index = parseInt(event.target.dataset.id) - selectedShipIndex + 10*i
                if(squares[index].classList.contains('taken')) return
            }

            for (let i=0; i < draggedShipLength; i++) {
                const index = parseInt(event.target.dataset.id) - selectedShipIndex + 10*i
                let directionClass
                // if (i === 0) directionClass = 'start'
                // if (i === draggedShipLength - 1) directionClass = 'end'
                squares[index].classList.add('taken', 'vertical', directionClass, shipClass)
            }

        } else return

        const displayGrid = document.querySelector('.grid-display')

        displayGrid.removeChild(draggedShip)

        if(document.querySelector('.grid-display').children.length === 0) setIsOver(true)
    }


    const handleConfirmPositions = () => {

        const takenSquares = document.querySelectorAll('.taken')

        const coords = []

        takenSquares.forEach(s => {

            const x = s.dataset.id%10
            const y = Math.floor(s.dataset.id/10)

            coords.push([x, y])

        })

        onConfirm(coords)

        // console.log(coords)

        // takenSquares.forEach(s => console.log('X: ' + s.dataset.id%10 + '; Y: ' + Math.floor(s.dataset.id/10)))

    }

    const handleRandomClick = () => {
        onRandom()
    }

    return (
        <div className={'game container'}>

            <h1 className={'waiting-title'}> Place your ships! </h1>

            <div className={'board-container'}>
                <div className={'user-board'}></div>

            </div>

            <div className={'btn-container'}>
                <button className={'start-button'} onClick={handleButtonClick} > {isOver ? "Confirm" : "Rotate"} </button>
                <button className={'start-button'} onClick={handleRandomClick}> Random </button>
            </div>

            <div className="board-container">
                <div className="grid-display">
                    <div className="ship destroyer-container" draggable="true"
                        onMouseDown={handleMouseDown}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}>
                        <div id="destroyer-0"></div>
                        <div id="destroyer-1"></div>

                    </div>

                    <div className="ship submarine-container" draggable="true"
                         onMouseDown={handleMouseDown}
                         onDragStart={handleDragStart}
                         onDrop={handleDrop}>
                        <div id="submarine-0"></div>
                        <div id="submarine-1"></div>
                        <div id="submarine-2"></div>

                    </div>

                    <div className="ship cruiser-container" draggable="true"
                         onMouseDown={handleMouseDown}
                         onDragStart={handleDragStart}
                         onDrop={handleDrop}>

                        <div id="cruiser-0"></div>
                        <div id="cruiser-1"></div>
                        <div id="cruiser-2"></div>

                    </div>


                    <div className="ship battleship-container" draggable="true"
                         onMouseDown={handleMouseDown}
                         onDragStart={handleDragStart}
                         onDrop={handleDrop}>

                        <div id="battleship-0"></div>
                        <div id="battleship-1"></div>
                        <div id="battleship-2"></div>
                        <div id="battleship-3"></div>

                    </div>

                    <div className="ship carrier-container" draggable="true"
                         onMouseDown={handleMouseDown}
                         onDragStart={handleDragStart}
                         onDrop={handleDrop}>


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