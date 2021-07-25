import React, { useCallback } from 'react';
import "./CustomPlayer.css"
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { IconButton, makeStyles } from '@material-ui/core';
import ShowChat from '@material-ui/icons/VisibilityOff';
import HideChat from '@material-ui/icons/Visibility';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { useContext } from 'react';
import { DataContext } from '../../../App';
import { useRef, useEffect, useState } from 'react';
import Volume from './Volume';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlaybackRate from './PlaybackRate';
import Forward5Icon from '@material-ui/icons/Forward5';
import Replay5Icon from '@material-ui/icons/Replay5';
import ProgressBar from './ProgressBar';
import LiveButton from './LiveButton';
import { useDispatch, useSelector } from 'react-redux';
import { hiddenChatToggle, togglePlaying } from '../../../redux/playerState';
import Quality from './PlayerSettings/Quality';
import { isMobile, MobileView } from "react-device-detect";


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
    },

    skipSeconds:{
        fontSize:'150px',
        position:'absolute',
        top:'50%',
        left:'50%',
        transform:'translate(-50%,-50%)',
    },

    mobilePauseVideoButton:{
        position:'absolute',
        top:'50%',
        left:'50%',
        transform:'translate(-50%,-50%)',
        color:'white'
    }
})


const mobileToggleIconStyles = {
    fontSize: '60px',
    textShadow:'0 0 10px black'
}

const CustomPlayer = ({playerWrapperRef}) => {


    const {isLive, isPlaying, progress, duration, playbackRate, videoProgress, admin ,hiddenChat, videoTitle, currentVideoLink,nickname,currentAvailableFormats} = useSelector(state=> state.player)

    const dispatch = useDispatch()

    const { socket } = useContext(DataContext)

    const classes = useStyles()


    const [currentProgress, setCurrentProgress] = useState(0);
    const [isTimeShow, setIsTimeShow] = useState(false);
    const [timeToShow, setTimeToShow] = useState(null)
    const [loadedSeconds, setLoadedSeconds] = useState(0);
    const [secondsSkip, setSecondsSkip] = useState(false);


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
        if(isMobile) return false

        if([...e.target.classList].includes("customPlayer")){
        socket.emit('canPlay')
        }
    }

    const handlePlayScreenMobile = () =>{
        socket.emit('canPlay')
    }



    useEffect(()=>{
        socket.on('secondsSkipAnswer', ({type})=>{
            setSecondsSkip(type)
            setTimeout(() => {
                setSecondsSkip(false)
            }, 500);
        })

        return ()=>{
            socket.off('secondsSkipAnswer')
        }
    },[socket])

    useEffect(()=>{
        socket.on('canPlayAnswer', (answer)=>{
            if(answer){
                dispatch(togglePlaying())
            }
        })

        return () =>{
            socket.off('canPlayAnswer')
        }
    },[dispatch, socket])


    useEffect(()=>{
        const loadedSeconds = videoProgress?.loadedSeconds
        setLoadedSeconds(loadedSeconds/duration * 100)
    },[videoProgress,duration])



    const handleProgressChange = (e) =>{
        if(!admin || !currentVideoLink || isLive) return false
        const position = e.target.getBoundingClientRect();
        const procents =  (e.pageX - position.x)/position.width
        const time = convertSeconds(duration * procents)
        const prettyTime = `${time.hours}:${time.minutes}:${time.seconds}`
        // WARTOSC W PROCENTACH 
        socket.emit('changeTime', {procents, nickname, prettyTime})
    }


    useEffect(()=>{
        // PROGRESS BAR ANIMATION
            setCurrentProgress(progress/duration*100)        
        
    },[duration,progress])


    const handleFullScreen = () =>{
        screenfull.toggle()
    }


    const EscCloseFullScreen = useCallback((e) =>{
         playerWrapperRef.current.classList.toggle('fullscreenPlayer')
    },[playerWrapperRef])

    useEffect(()=>{
        document.addEventListener('fullscreenchange', EscCloseFullScreen )

        return () =>{
        document.removeEventListener('fullscreenchange',EscCloseFullScreen )
        }
    },[EscCloseFullScreen])



    const progressRef = useRef(null)

    const handleToggleShowTimeAbove = () =>{
        setIsTimeShow(prev=> !prev)
    }


    const handleTogglePlayServer = () =>{
        if(!admin){
            return dispatch(togglePlaying())
        }

        socket.emit('togglePlay')

    }

    const handleTimeToShow = (e) =>{
        if(!admin) return false
        const position = progressRef.current.getBoundingClientRect();
        const procents =  ((e.pageX - position.x)/position.width)
        setTimeToShow(convertSeconds(Math.floor(procents*duration)));
    }


    const handleToggleChat = () =>{
        dispatch(hiddenChatToggle())
    }

    
    const handleSkipVideo = () => {
		if (admin) {
			socket.emit("skipVideo", {nickname});
		}
	};


    const timer = isLive ? 
    <span className='live'>LIVE</span> 
    : 
    `${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds} / ${hours}:${minutes}:${seconds}`

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


            {secondsSkip && 
                <div className="secondsSkip">
                       {secondsSkip === "FORWARD" ? 
                        <Forward5Icon className={classes.skipSeconds} />
                       :
                        <Replay5Icon className={classes.skipSeconds} />
                       }
                        
                    </div>
            }

            {/* BUTTON ONLY FOR MOBILE DEVICES  */}
            <MobileView>
               {currentVideoLink &&
                    <IconButton onClick={handlePlayScreenMobile} className={classes.mobilePauseVideoButton} >

                    {isPlaying ?
                    <PauseIcon style={mobileToggleIconStyles} />
                    : 
                    <PlayArrowIcon style={mobileToggleIconStyles} />
                    }

                    </IconButton>
                }
                
            </MobileView>

            <div className="controls" ref={controlsRef}>


           {!isLive &&  <ProgressBar // IF LIVE PROGRESS BAR IS OFF
            progressRef={progressRef} 
            isTimeShow={isTimeShow} 
            timeToShow={timeToShow} 
            isLive={isLive} 
            currentProgress={currentProgress} 
            loadedSeconds={loadedSeconds} 
            handleProgressChange={handleProgressChange} 
            handleToggleShowTimeAbove={handleToggleShowTimeAbove} 
            handleTimeToShow={handleTimeToShow}
            />
            }

        


                <div className="lowerControls" >
                    <div className="playButton">
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

                    
                
                    <Volume />

                    <div className="durationBar">
                            {timer}
                    </div>      
                    


                    <div className="fullScreen">

                        {!isLive && admin && <LiveButton/>}


                        {!isLive && ( // IF LIVE PLAYBACKRATE IS OFF
                           <PlaybackRate playbackRate={playbackRate} /> 
                        )}

                        {currentAvailableFormats && <Quality/>}

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