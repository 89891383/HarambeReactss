import { Fade } from '@material-ui/core';
import ShowTime from './ShowTime';

const ProgressBar = ({progressRef, isTimeShow, timeToShow, currentProgress, loadedSeconds, handleProgressChange, handleToggleShowTimeAbove, handleTimeToShow}) => {
    return ( 

        <div className="progressBar" ref={progressRef} >
                            
          
            <Fade in={isTimeShow} unmountOnExit >
                <div>
                    <ShowTime time={timeToShow}  />
                    
                </div>
            </Fade>
            
            <div className="progressOverflowDiv">

         
                <div 
                    className="currentProgress" 
                    style={{transform:`translateX(${currentProgress < 100 ? -100 + currentProgress : 0}%)`}}
                >
                </div>
            


                <div 
                    className="loadedProgress"
                    style={{transform:`translateX(${loadedSeconds < 100 ? -100 + loadedSeconds : 0}%)`}}
                >
                </div>
                <div 
                    className="progressBackground" 
                    onClick={handleProgressChange}
                    onMouseOver={handleToggleShowTimeAbove}
                    onMouseLeave={handleToggleShowTimeAbove}
                    onMouseMove={handleTimeToShow}
                ></div>
            </div>

                

        
        </div>

     );
}
 
export default ProgressBar;