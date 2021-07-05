import SettingsIcon from '@material-ui/icons/Settings';
import { IconButton, makeStyles } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import "./PlayerSettings.css"
import { useClickAway } from 'react-use';
import Delay from './Delay';


const useStyles = makeStyles({
    settingsIcon:{
        height:'100%',
        width:'auto',
        color:'white',
        transition:'300ms color ease',
        margin:'none',
        '&:hover':{
            color:'rgb(63,81,181)'
        }
    },
    button:{
        backgroundColor:'white',
        color:'black',
        width:'15px',
        height:'30px',
        "&:hover":{
            backgroundColor:'white',
            color:'red'
        }
    }
})

const PlayerSettings = () => {

    const classes = useStyles()


    const ref = useRef(null)

    
    useClickAway(ref, ()=>{
        setIsOpen(false)
    })

    const [isOpen, setIsOpen] = useState(false);

    return ( 
        <div className="playerSettings">
            <IconButton 
            className={classes.settingsIcon} 
            onClick={()=>setIsOpen(prev=> !prev)}>
                <SettingsIcon/>
            </IconButton>


            
            <CSSTransition in={isOpen} unmountOnExit timeout={300} classNames='transition' >
                <div className="playerSettingsDialog" ref={ref}>
                    
                <Delay/>

                </div>
            </CSSTransition>
            

        </div>
     );
}
 
export default PlayerSettings;