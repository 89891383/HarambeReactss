import React from 'react';
import "./CustomPlayer.css"
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { IconButton, LinearProgress, makeStyles, Slider } from '@material-ui/core';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { useContext } from 'react';
import { DataContext } from '../../App';
import { useRef } from 'react';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
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
    progress:{
        height:'10px',
        borderRadius:'5px'
    }
})

const CustomPlayer = ({setIsPlaying,isPlaying,progress,duration, setVolume,volume}) => {

    const { admin,socket,nickname } = useContext(DataContext)

    const classes = useStyles()

    const playVideo = () =>{
        setIsPlaying(prev=> !prev)
    }

    const convertSeconds = (time) =>{
        let minutes = Math.floor(time / 60)
        const hours = Math.floor(minutes/60)
        const seconds  = Math.floor(time - (60 * minutes))
        minutes = minutes%60

        return {seconds, minutes, hours}
    }

    const {seconds,minutes, hours} = convertSeconds(duration)


    const currentTime =  convertSeconds(Math.floor(progress))

    const formatTime = (time) =>{
     return time < 10 ? `0${time}` : time
    }

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
        setVolume(0)
    }


    const handleProgressChange = (e) =>{
        if(!admin) return false
        const position = e.target.getBoundingClientRect();
        const procents =  (e.pageX - position.x)/position.width
        // WARTOSC W PROCENTACH 
        socket.emit('changeTime', {procents, nickname})
    }

    const handleFullScreen = () =>{
        const playerWrapper = document.querySelector('player-wrapper')
        screenfull.toggle(playerWrapper)
    }

    return ( 
        <div className="customPlayer" onClick={handlePlayScreen}>
            <div className="controls" ref={controlsRef}>
                <div className="playButton" onClick={playVideo}>
                    <IconButton className={classes.playButton}>
                          {isPlaying ?
                            <PauseIcon  /> : 
                            <PlayArrowIcon />}
                    </IconButton>
                  
                </div>

                <div className="progressBar">
                    
                        <LinearProgress className={classes.progress} variant="determinate" onClick={handleProgressChange} value={progress/duration *100} />
                    
                   
                </div>
                <div className="durationBar">
                    {`${formatTime(currentTime.hours)}:${formatTime(currentTime.minutes)}:${formatTime(currentTime.seconds)}`}
                            /
                   {`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}

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