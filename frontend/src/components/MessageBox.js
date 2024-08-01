import { Link } from "react-router-dom";

function MessageBox(props){
    const {message, type, link , linkMessage} = props;
    return(
        <div className={`alert ${type}`}>
            <p>{message}</p>
            <Link to={link}><p style={{color:'black', textDecoration:'underline'}}>{linkMessage}</p></Link>
        </div>
    )
}

export default MessageBox;