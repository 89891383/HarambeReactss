import SettingsIcon from '@material-ui/icons/Settings';
import { IconButton, makeStyles } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import "./CustomPlayer.css"
import { useClickAway } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import { changeMaxDelay } from '../../../redux/playerState';
import Button from '@material-ui/core/Button';

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

    const { maxDelay } = useSelector(state=> state.player)

    const dispatch = useDispatch()

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
                    
                    <Button
                    variant="outlined"
                    color="primary"
                    onClick={()=> dispatch(changeMaxDelay(-1))}>-</Button>
                    <span className="delay">
                        {maxDelay}
                    </span>
                    <Button 
                    color="primary"
                    variant="outlined"
                    onClick={()=> dispatch(changeMaxDelay(1))}>+</Button>

                </div>
            </CSSTransition>
            

        </div>
     );
}
 
export default PlayerSettings;