import {draw} from './drawing'
import {useRef, useEffect} from "react"

function App() {
    
    const canvasRef = useRef(null);
    useEffect(() => {
        let intervalId = setInterval(() =>  draw(canvasRef.current), 20);
        return () => {clearInterval(intervalId);};
    }, []);

	return (
        <canvas
            ref={canvasRef}
            height={window.innerHeight}
            width={window.innerWidth}
        />
    );
}

export default App;