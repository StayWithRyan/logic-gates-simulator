import './style.css';
import Constants from '../constants';
import {setCreatingElementName} from '../App';

function ModalCreatingElement(props) {
    return (
        <div className="modal" onClick = {props.handleCloseInfo}>
            <input
                type="text" className="textBox" placeholder="Element name" 
                style={{borderBottom: `5px solid ${Constants.elementsColor}`,
                    backgroundColor: Constants.backgroundColor, color: "white"
                }}
                onChange={(event) => setCreatingElementName(event.target.value)}
            />
        </div>
    );
}

export default ModalCreatingElement;