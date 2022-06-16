import './Positioning.css'
import React, {useEffect, useState} from "react";


function Positioning () {

    //LOAD BOARD

    const squares = []
    const ships= document.querySelectorAll('.ship')
    const [load, setLoad] = useState(true)

    useEffect(() => {

        if(load) {
            renderSquares()
            setLoad(false)

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

    //SHIP ROTATION

    let horizontal = true

    function rotateShips() {

        horizontal = !horizontal

        ships.forEach( (s) => {

            s.classList.toggle(s.className.split(" ")[1] + '-vertical')

        })

    }

    //SHIP DRAG&DROP

    const [selectedShipId, setSelectedShipId] = useState(0)

    const handleMouseDown = (event) => {

        setSelectedShipId(parseInt(event.target.id.substr(-1)))

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

        let draggedShip = document.querySelector(event.dataTransfer.getData('ship'))
        let draggedShipLength = draggedShip.children.length
        console.log(draggedShip)
        console.log(draggedShipLength)

        let shipNameWithLastId = draggedShip.lastChild.id
        let shipClass = shipNameWithLastId.slice(0, -2)
        // console.log(shipClass)

        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
        let shipLastId =  parseInt(event.target.dataset.id)
        console.log(shipLastId)

        // //TODO: fix selectedShipId
        shipLastId = shipLastId - selectedShipId
        console.log(shipLastId)

        for(let i=0; i < draggedShipLength; i++ ) {
            let directionClass
            if (i === 0) directionClass = 'start'
            else if (i === draggedShipLength-1) directionClass = 'end'

            console.log(parseInt(event.target.dataset.id) - selectedShipId + i)

            console.log(horizontal)

            squares[parseInt(event.target.dataset.id) - selectedShipId + i].classList.add('taken', horizontal ? 'horizontal' : 'vertical', directionClass, shipClass)
        }

        document.querySelector('.grid-display').removeChild(draggedShip)
        //     if(!displayGrid.querySelector('.ship')) allShipsPlaced =s true

    }



    // function dragDrop() {
    //     let shipNameWithLastId = draggedShip.lastChild.id
    //     let shipClass = shipNameWithLastId.slice(0, -2)
    //     // console.log(shipClass)


    //     let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
    //     let shipLastId = lastShipIndex + parseInt(this.dataset.id)
    //     // console.log(shipLastId)
    //
    //
    //     selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))
    //
    //     shipLastId = shipLastId - selectedShipIndex
    //     // console.log(shipLastId)
    //
    //     if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
    //         for (let i=0; i < draggedShipLength; i++) {
    //             let directionClass
    //             if (i === 0) directionClass = 'start'
    //             if (i === draggedShipLength - 1) directionClass = 'end'
    //             userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass)
    //         }
    //         //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
    //         //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
    //     } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
    //         for (let i=0; i < draggedShipLength; i++) {
    //             let directionClass
    //             if (i === 0) directionClass = 'start'
    //             if (i === draggedShipLength - 1) directionClass = 'end'
    //             userSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', 'vertical', directionClass, shipClass)
    //         }
    //     } else return



    //
    //     displayGrid.removeChild(draggedShip)
    //     if(!displayGrid.querySelector('.ship')) allShipsPlaced = true
    // }


    return (
        <div className={'container'}>

            <div className={'board-container'}>
                <div className={'user-board'}></div>
            </div>

            <button className={'rotate-btn'} onClick={rotateShips}> Rotar </button>

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