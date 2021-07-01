import {  IconButton, makeStyles,  } from '@material-ui/core';
import { useContext } from 'react';
import { DataContext } from '../../../App';

const useStyles = makeStyles({
    liveButton:{
        fontSize:'16px',
        color:'white',
        fontWeight:'700',
        letterSpacing:'1px',
        '&:hover':{
            color:'#f94144'
        }
    }
})

const LiveButton = () => {

    const { socket,admin } = useContext(DataContext) 

    const classes = useStyles()

    const handleLive = () =>{
        if(admin){
            socket.emit('liveVideo')
            console.log('emit');
        }
    }

    return ( 
        <IconButton className={classes.liveButton} onClick={handleLive} >
            LIVE
        </IconButton>
     );
}
 
export default LiveButton;