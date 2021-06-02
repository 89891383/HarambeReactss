import React from 'react';
import "./CustomPlayer.css"
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { IconButton, makeStyles } from '@material-ui/core';
import ShowChat from '@material-ui/icons/VisibilityOff';
import HideChat from '@material-ui/icons/Visibility';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { useContext } from 'react';
import { DataContext } from '../../App';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ShowTime from './ShowTime';
import Volume from './Volume';
import SkipNextIcon from '@material-ui/icons/SkipNext';
const screenfull = require('screenfull');

const useStyles = makeStyles({
    playButton:{
        height:'100%',
        width:'auto',
        color:'white',
        transition:'300ms color ease',
        margin:'none',
        '&:hover':{
            color:'rgb(63,81,181)'
        }
    },
    volumeBtn:{
        color:'white',
        width:'48px',
        height:'48px',
        '&:hover':{
            color:'rgb(63,81,181)'
        }   
    },
    toggleChat:{
        color:'white',
        backgroundColor:' rgba(0, 0, 0, 0.2)',
        '&:hover':{
            color:'rgb(63,81,181)',
            backgroundColor:' rgba(0, 0, 0, 0.2)',
        }   
    }

})



const CustomPlayer = ({setIsPlaying,isPlaying,progress,duration, setVolume,volume,}) => {

    const { admin,socket,nickname,hiddenChat, setHiddenChat,videoTitle,setVideoTitle,currentVideoLink } = useContext(DataContext)

    const classes = useStyles()

    const [currentProgress, setCurrentProgress] = useState(0);
    const [isTimeShow, setIsTimeShow] = useState(false);
    const [timeToShow, setTimeToShow] = useState(null)


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


	useEffect(() => {
        if(!videoTitle && currentVideoLink){
           fetch(`https://noembed.com/embed?url=${currentVideoLink}`)
			.then((res) => res.json())
			.then((res) => {
				setVideoTitle(res.title)
			});
        }
		
	}, [setVideoTitle,currentVideoLink, videoTitle]);


    const handleFullScreen = () =>{
        const playerWrapper = document.querySelector('player-wrapper')
        screenfull.toggle(playerWrapper)
    }

    const progressRef = useRef(null)

    const handleToggleShowTimeAbove = () =>{
        setIsTimeShow(prev=> !prev)
    }




    const handleTogglePlayServer = () =>{
        if(!admin) return false

        socket.emit('togglePlay', {isPlaying: !isPlaying,nickname})

    }

    const handleTimeToShow = (e) =>{
        if(!admin) return false
        const position = progressRef.current.getBoundingClientRect();
        const procents =  ((e.pageX - position.x)/position.width)
        setTimeToShow(convertSeconds(Math.floor(procents*duration)));
    }


    const handleToggleChat = () =>{
        setHiddenChat(prev=> !prev)
    }

    
    const handleSkipVideo = () => {
		if (admin) {
			socket.emit("skipVideo");
		}
	};

    return ( 
        <div className="customPlayer" onClick={handlePlayScreen}>

            <div className="videoTitlePlayer" title={videoTitle} >
                {videoTitle}
            </div>

            <div className="toggleChat">
                <IconButton className={classes.toggleChat} onClick={handleToggleChat}>
                        {!hiddenChat ? <ShowChat/> : <HideChat/>}
                    
                </IconButton>
            </div>

            <div className="controls" ref={controlsRef}>

                
                    <div className="progressBar" ref={progressRef} >
                        
                       
                        {isTimeShow && <ShowTime time={timeToShow} />}
                        
                     
                        <div className="currentProgress" 
                        style={{width:`${currentProgress < 100 ? currentProgress : 100}%`}} >

                        </div>
                        <div 
                        className="progressBackground" 
                        onClick={handleProgressChange}
                        onMouseOver={handleToggleShowTimeAbove}
                        onMouseLeave={handleToggleShowTimeAbove}
                        onMouseMove={handleTimeToShow}
                        ></div>

                       
                    </div>
                


                <div className="lowerControls" >
                    <div className="playButton" onClick={playVideo}>
                        <IconButton className={classes.playButton} onClick={handleTogglePlayServer}>
                            {isPlaying ?
                                <PauseIcon  /> : 
                                <PlayArrowIcon />}
                        </IconButton>
                    
                    </div>

                    {/* SKIP ONLY FOR ADMINS */}
                    {admin && 
                        <div className="skipButton">
                            <IconButton onClick={handleSkipVideo} className={classes.playButton}>
                                <SkipNextIcon/>
                            </IconButton>
                        </div>
                    }

                    
                    
                    
                
                    <Volume setVolume={setVolume} volume={volume} />

                    <div className="durationBar">
                            {`${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds} `}
                                    /
                            {` ${hours}:${minutes}:${seconds}`}

                    </div>      
                    

                    
                    <div className="fullScreen">
                        <IconButton className={classes.playButton} onClick={handleFullScreen}>
                            <FullscreenIcon/>
                        </IconButton>
                    </div>
                </div>


                
            </div>
           
        </div>
     );
}
 
export default CustomPlayer;