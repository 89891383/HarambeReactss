import { IconButton, makeStyles } from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';
import { useContext, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { DataContext } from '../../App';

const useStyles = makeStyles({
    timer:{
        width:'48px',
        height:'48px',
        color:'white',
        '&:hover':{
            color:'rgb(63,81,181)'
        }   
    }
})

const PlaybackRate = ({setPlaybackRate}) => {

    const {socket, admin} = useContext(DataContext)

    const classes = useStyles()

    const [isOpen, setIsOpen] = useState(false)

    const handlePlaybackRate = (e) =>{
        if(!Number(e.target.textContent) || !admin) return setIsOpen(false)
        setPlaybackRate(Number(e.target.textContent))
        setIsOpen(false)
        socket.emit('playbackRate', Number(e.target.textContent))
    }



    return (
      
        <div className="playbackRate">
            <IconButton className={classes.timer} onClick={()=>setIsOpen(prev=> !prev)} >
                <TimerIcon  />
            </IconButton>

            <CSSTransition in={isOpen} unmountOnExit timeout={300} classNames="transition">
                <div className="playbackRateChoose" onClick={handlePlaybackRate}>
                    <div className="playbackOption">2</div>
                    <div className="playbackOption">1.5</div>
                    <div className="playbackOption">1</div>
                    <div className="playbackOption">0.5</div>   
                </div>
            </CSSTransition>

        </div> 
        
     );
}
 
export default PlaybackRate;