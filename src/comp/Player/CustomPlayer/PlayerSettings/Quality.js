import HighQualityIcon from '@material-ui/icons/HighQuality';
import { IconButton, makeStyles } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import "./Quality.css"
import { useClickAway } from 'react-use';
// import Delay from './Delay';
import { useSelector } from 'react-redux';
import FormatOption from './FormatOption';


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

const Quality = () => {

    const classes = useStyles()

    let {currentAvailableFormats} = useSelector(state=> state.player)

    const ref = useRef(null)

    const SettingsButtonRef = useRef(null)

    
    useClickAway(ref, (e)=>{
        if(e.target.tagName === 'BUTTON'|| e.target.tagName === 'path' || e.target.tagName === 'svg') return false
        setIsOpen(false)
    })

    const createFormats = currentAvailableFormats?.map(item=>{
      return <FormatOption item={item} key={item.url}/>
    })



    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () =>{
        setIsOpen(false)
    }

    return ( 
        <div className="playerSettings" ref={SettingsButtonRef}>
            <IconButton 
            className={classes.settingsIcon} 
            onClick={()=>setIsOpen(prev => !prev)}>
                <HighQualityIcon/>
            </IconButton>


            
            <CSSTransition in={isOpen} unmountOnExit timeout={300} classNames='transition' >
                <div className="playerSettingsDialog" onClick={handleClose} ref={ref}>
                    
                {createFormats}

                </div>
            </CSSTransition>
            

        </div>
     );
}
 
export default Quality;