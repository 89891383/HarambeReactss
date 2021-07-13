import { IconButton, makeStyles } from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';
import { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { DataContext } from '../../../App';
import { useClickAway } from 'react-use'
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
    timer:{
        width:'48px',
        height:'48px',
        color:'white',
        '&:hover':{
            color:'rgb(63,81,181)'
        },
        '@media (max-width: 500px)':{
            display:'none'
        }
    }
})

const PlaybackRate = ({playbackRate}) => {

    const {admin} = useSelector(state=> state.player)

    const {socket} = useContext(DataContext)

    const classes = useStyles()

    const chooseRef = useRef(null)

    const containerRef = useRef(null)

    const [isOpen, setIsOpen] = useState(false)

    useClickAway(containerRef, (e)=>{
        setIsOpen(false)
    })

    const handlePlaybackRate = (e) =>{

        const chooseNumber = Number(e.target.textContent)

        if(!chooseNumber|| !admin) return setIsOpen(false)
        setIsOpen(false)
        if(playbackRate === chooseNumber) return false
        socket.emit('playbackRate', chooseNumber)
    }

    useEffect(()=>{
        if(chooseRef.current){
            [...chooseRef.current.children].forEach(item=> {
                if(Number(item.textContent) === playbackRate ){
                    item.style.backgroundColor = "#101010"
                }
            })
        }

    },[chooseRef,isOpen,playbackRate])



    return (
      
        <div className="playbackRate" ref={containerRef} >
            <IconButton className={classes.timer} onClick={()=>setIsOpen(prev=> !prev)} >
                <TimerIcon  />
            </IconButton>

            <CSSTransition in={isOpen} unmountOnExit timeout={300} classNames="transition" >
                <div className="playbackRateChoose" onClick={handlePlaybackRate} ref={chooseRef} >
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