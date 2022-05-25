
import "./TitlePage.css";
import {useNavigate} from "react-router-dom";

function TitlePage() {

    const navigate = useNavigate();

return (
        <div>
            <div className={'title-container'}>
                <h1>Batalla Naval</h1>
            </div>
            <div className={'button-container'}>
                <button className={'login'} onClick={() => {
                    navigate("/chat")
                }}>Log In</button>
            </div>
        </div>
    );

}

export default TitlePage;