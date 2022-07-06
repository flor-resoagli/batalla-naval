import {CircularProgress} from "@mui/material";


function Loading()  {

    return (
        <div className={"waiting-page"}>
            <div className={'loader-container'}>
                <CircularProgress color={'inherit'}/>
            </div>
        </div>
    )

}

export default Loading