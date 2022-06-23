import {CircularProgress} from "@mui/material";


function Standby() {

    return (
        <div className={"waiting-page"}>

            <h4>Esperando al segundo jugador...</h4>
            <div className={'loader-container'}>
                <CircularProgress color={'inherit'}/>
            </div>
        </div>
    )

}

export default Standby