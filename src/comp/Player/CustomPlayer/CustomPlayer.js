import React, { useCallback } from 'react';
import "./CustomPlayer.css"
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { Box, makeStyles, Typography } from '@material-ui/core';
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
import Title from './Title';


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
        color:'white',
        padding:'5px',
        borderRadius:'5px',
        display:'flex',
        transition:'300ms',
        '&:hover':{
            backgroundColor:'rgba(255, 255, 255, 0.3);'
        }
    },
    box:{
        padding:'5px',
        borderRadius:'5px',
        display:'flex',
        transition:'300ms',
        cursor:'pointer',
        '&:hover':{
            backgroundColor:'rgba(255, 255, 255, 0.3)'
        }
    },
    timer:{
        fontWeight:'700',
        '@media (max-width:600px)':{
            display:'none'
        }
    }
})


const mobileToggleIconStyles = {
    fontSize: '60px',
    textShadow:'0 0 10px black'
}

const CustomPlayer = ({playerWrapperRef}) => {


    const {isLive, isPlaying, progress, duration, admin ,hiddenChat, currentVideoLink,nickname,currentAvailableFormats} = useSelector(state=> state.player)

    const dispatch = useDispatch()

    const { socket } = useContext(DataContext)

    const classes = useStyles()


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



    const handleTogglePlayServer = () =>{
        if(!admin){
            // return dispatch(togglePlaying())
            return socket.emit('canPlay')
        }

        socket.emit('togglePlay')

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
    `${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds}`


    return ( 
        <div className="customPlayer" onClick={handlePlayScreen}>
            <Title/>

            <div className="toggleChat">
                <Box className={classes.box} onClick={handleToggleChat} >
                    {!hiddenChat ? <ShowChat/> : <HideChat/>}
                </Box>
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
                    <Box
                        onClick={handlePlayScreenMobile} 
                        className={classes.mobilePauseVideoButton} >
                           {isPlaying ?
                                <PauseIcon style={mobileToggleIconStyles} />
                            : 
                                <PlayArrowIcon style={mobileToggleIconStyles} />
                            }
                    </Box>
                }
                
            </MobileView>

            <div className="controls" ref={controlsRef}>

         

        


                <div className="lowerControls" >
                    <div className="playButton">
                            <Box  className={classes.box} onClick={handleTogglePlayServer}>
                                {isPlaying ?
                                <PauseIcon  /> : 
                                <PlayArrowIcon />
                                }
                            </Box>
                    </div>

                    {/* SKIP ONLY FOR ADMINS */}
                    {admin && 
                        <div className="skipButton">
                            <Box onClick={handleSkipVideo} className={classes.box}>
                                <SkipNextIcon/>
                            </Box>
                        </div>
                    }

                    
                
                    <Volume />

                    {/* <div className="durationBar">
                    </div>       */}
                    <Typography className={classes.timer}>
                        {timer}
                    </Typography>
                
                    {!isLive &&  
                        <ProgressBar/>
                        // IF LIVE PROGRESS BAR IS OFF 
                     }
                    
                   {!isLive &&
                    <Typography className={classes.timer} >
                        {`${hours}:${minutes}:${seconds}`}
                    </Typography>
                    }

                    <div className="fullScreen">

                        {!isLive &&  admin && <LiveButton/>}


                        {!isLive && ( // IF LIVE PLAYBACKRATE IS OFF
                           <PlaybackRate /> 
                        )}

                        {currentAvailableFormats && <Quality/>}

                        <Box className={classes.box} onClick={handleFullScreen}>
                            <FullscreenIcon/>
                        </Box>
                    </div>
                </div>


                
            </div>
           
        </div>
     );
}
 
export default CustomPlayer;