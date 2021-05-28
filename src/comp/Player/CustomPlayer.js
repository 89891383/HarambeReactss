import React from 'react';
import "./CustomPlayer.css"
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { IconButton, makeStyles, Slider } from '@material-ui/core';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { useContext } from 'react';
import { DataContext } from '../../App';
import { useRef } from 'react';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { useEffect } from 'react';
import { useState } from 'react';
// import { CSSTransition } from 'react-transition-group';
const screenfull = require('screenfull');

const useStyles = makeStyles({
    playButton:{
        height:'100%',
        width:'auto',
        color:'white',

    },
    volumeBtn:{
        color:'white',
        width:'30px',
        height:'30px',
    },

})

let beforeMute;

const CustomPlayer = ({setIsPlaying,isPlaying,progress,duration, setVolume,volume}) => {

    const { admin,socket,nickname } = useContext(DataContext)

    const classes = useStyles()

    // const [isTimeShow, setIsTimeShow] = useState(false)
    const [currentProgress, setCurrentProgress] = useState(0);

    const playVideo = () =>{
        setIsPlaying(prev=> !prev)
    }

    const formatTime = (time) =>{
        return time < 10 ? `0${time}` : time
    }

    const convertSeconds = (time) =>{
        let minutes = Math.floor(time / 60)
        let hours = Math.floor(minutes/60)
        let seconds  = Math.floor(time - (60 * minutes))
        minutes = formatTime(minutes%60)
        hours = formatTime(hours)
        seconds = formatTime(seconds) 

        return {seconds, minutes, hours}
    }

    const {seconds,minutes, hours} = convertSeconds(duration)


    const currentTime =  convertSeconds(Math.floor(progress))



    const controlsRef = useRef(null)

    const handlePlayScreen = (e) =>{
            if([...e.target.classList].includes("customPlayer")){
            setIsPlaying(prev=> !prev)
            }

    }

    const handleVolume = (e,value) =>{
        setVolume(value)
    }



    const handleMute = () =>{
 
        if(volume){
            beforeMute = volume 
            setVolume(0)
        }else{
            setVolume(beforeMute)
        }
    }


    const handleProgressChange = (e) =>{
        if(!admin) return false
        const position = e.target.getBoundingClientRect();
        const procents =  (e.pageX - position.x)/position.width
        // WARTOSC W PROCENTACH 
        socket.emit('changeTime', {procents, nickname})
    }

    useEffect(()=>{
        // PROGRESS BAR ANIMATION
        setCurrentProgress(progress/duration*100)
    },[duration,progress,currentProgress])

    const handleFullScreen = () =>{
        const playerWrapper = document.querySelector('player-wrapper')
        screenfull.toggle(playerWrapper)
    }

    const progressRef = useRef(null)
    // const showTimerRef = useRef(null)

    // const handleToggleShowTimeAbove = () =>{
    //     setIsTimeShow(prev=> !prev)
    // }

    // const handleShowTimeAbove = (e) =>{
    //     // if(!admin) return false
    //     if(!progressRef.current) return false
    //     const position = progressRef.current.getBoundingClientRect();
    //     const procents =  (e.pageX - position.x)/position.width
    //     const prettyDuration = convertSeconds(Math.floor(duration * procents))
    //     let {seconds, minutes, hours} = prettyDuration
    //     seconds = formatTime(seconds)
    //     minutes = formatTime(minutes)
    //     hours = formatTime(hours)
    //     // console.log(hours, minutes, seconds);
    //     showTimerRef.current.style.transform = `translate(${e.pageX-position.x}px, -160%)`
    //     console.log(showTimerRef.current);
    //     return `${hours}:${minutes}:${seconds}`
    // }



    const handleTogglePlayServer = () =>{
        if(!admin) return false

        socket.emit('togglePlay', {isPlaying: !isPlaying,nickname})

    }

    return ( 
        <div className="customPlayer" onClick={handlePlayScreen}>
            <div className="controls" ref={controlsRef}>
                <div className="playButton" onClick={playVideo}>
                    <IconButton className={classes.playButton} onClick={handleTogglePlayServer}>
                          {isPlaying ?
                            <PauseIcon  /> : 
                            <PlayArrowIcon />}
                    </IconButton>
                  
                </div>

                <div className="progressBar">
                        
                        {/* <CSSTransition 
                        in={isTimeShow} 
                        timeout={200}
                        classNames="transition"
                        unmountOnExit>
                        <div className="showTimer" ref={showTimerRef} >
                            {handleShowTimeAbove}
                        </div>
                        </CSSTransition> */}
                     
                        <div className="currentProgress" 
                        ref={progressRef} 
                        style={{width:`${currentProgress}%`}} >

                        </div>
                        <div className="progressBackground" 
                        onClick={handleProgressChange}  
                        ></div>

                       
                    
                   
                </div>
                <div className="durationBar">
                    {`${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds}`}
                            /
                   {`${hours}:${minutes}:${seconds}`}

                </div>
                <div className="volumeBar">
                    <IconButton onClick={handleMute} className={classes.volumeBtn} >
                        {volume ? <VolumeUpIcon /> : <VolumeOffIcon/> }
                    </IconButton>
                   
                        <Slider min={0} max={1} step={0.01} value={volume} onChange={handleVolume} />
            
                </div>
                

                
                <div className="fullScreen">
                    <IconButton className={classes.playButton} onClick={handleFullScreen}>
                        <FullscreenIcon/>
                    </IconButton>
                </div>
            </div>
           
        </div>
     );
}
 
export default CustomPlayer;