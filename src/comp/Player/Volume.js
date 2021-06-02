import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import React, {useState} from 'react';
import { IconButton, makeStyles, Slider } from '@material-ui/core';


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

const Volume = ({setVolume,volume}) => {

    const [isSlider, setIsSlider] = useState(false);

    const classes = useStyles()

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


    const toggleSlider = () =>{
        setIsSlider(prev=> !prev)
        console.log('changed');
    }

    return ( 
        <div className="volumeBar" onMouseEnter={toggleSlider} onMouseLeave={toggleSlider}
        style={isSlider ? {width:"170px"} : {width:'40px'}}
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