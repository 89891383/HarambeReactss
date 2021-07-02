import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import React, {useState} from 'react';
import { IconButton, makeStyles, Slider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { changeVolume } from '../../../redux/playerState';


const useStyles = makeStyles({
    volumeBtn:{
        color:'white',
        width:'48px',
        height:'48px',
        transition:'0.3s',
        '&:hover':{
            color:'rgb(63,81,181)'
        }   
    },
})

let beforeMute;

const Volume = () => {

    const {volume} = useSelector(state=> state.player)

    const dispatch = useDispatch()

    const [isSlider, setIsSlider] = useState(false);

    const classes = useStyles()

    const handleVolume = (e,value) =>{
        dispatch(changeVolume(value))
    }



    const handleMute = () =>{
 
        if(volume){
            beforeMute = volume 
            dispatch(changeVolume(0))
        }else{
            dispatch(changeVolume(beforeMute))
        }
    }


    const toggleSlider = () =>{
        setIsSlider(prev=> !prev)
    }

    return ( 
        <div className="volumeBar" onMouseEnter={toggleSlider} onMouseLeave={toggleSlider}
        style={isSlider ? {width:"200px"} : {width:'40px'}}
        >
            <IconButton  onClick={handleMute} className={classes.volumeBtn} >
                 {volume ? <VolumeUpIcon /> : <VolumeOffIcon/> }
            </IconButton>
            
                {isSlider && 
                    <div style={{width:'120px'}}>
                        <Slider min={0} max={1} step={0.01} value={volume} onChange={handleVolume} />
                    </div>
                }
        </div>
     );
}
 
export default Volume;