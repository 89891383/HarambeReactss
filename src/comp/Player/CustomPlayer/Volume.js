import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import React, {useState} from 'react';
import { Box, makeStyles, Slider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { changeVolume } from '../../../redux/playerState';


const useStyles = makeStyles({
    box:{
        padding:'5px',
        borderRadius:'5px',
        display:'flex',
        transition:'300ms',
        '&:hover':{
            backgroundColor:'rgba(255, 255, 255, 0.3);'
        }
    }
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
        style={isSlider ? {width:"180px"} : {width:'40px'}}
        >
            <Box  onClick={handleMute} className={classes.box} >
                 {volume ? <VolumeUpIcon /> : <VolumeOffIcon/> }
            </Box>
            
                {isSlider && 
                    <div style={{width:'120px', display:'flex'}}>
                        <Slider min={0} max={1} step={0.01} value={volume} onChange={handleVolume} />
                    </div>
                }
        </div>
     );
}
 
export default Volume;