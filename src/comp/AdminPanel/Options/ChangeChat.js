import { Button, IconButton, makeStyles } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import {DataContext} from '../../../App'
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
    btn:{
        backgroundColor:'#6441a5',
        color:'white',
        // width:'100%'
        '&:hover':{
            borderColor:'#6441a5'
        }
    },
    closeButton:{
        position:'absolute',
        top:'0',
        left:'100%',
        transform:'translate(-100%, 0)',
        color:'white'
    },
    changeButton:{
        color:'white',
        backgroundColor:'#6441a5',
        border:'1px solid transparent',
        padding:'5px 20px',
        "&:hover":{
            border:'1px solid #6441a5'
        }
    }

})


const ChangeChat = () => {

    const { socket } = useContext(DataContext)

    const [isOpen, setIsOpen] = useState(false);

    const [newChat, setNewChat] = useState('');


    const openChangeAdmin = () =>{
        setIsOpen(prev=> !prev)
    }

    const handleChangeChat = (e) =>{
        e.preventDefault()
        if(newChat){
            socket.emit('changeTwitchChat', newChat)
            setNewChat('')
        }
        setIsOpen(false)
    }

    const classes = useStyles()

    return ( 
        <div className="oneOption">
            <Button onClick={openChangeAdmin} className={classes.btn} variant='outlined'>Change chat</Button>


        {/* INSER NEW ADMIN CONTAINER */}
        <CSSTransition classNames="transition" in={isOpen} timeout={300} unmountOnExit>
            <div className="insertChat">

                <IconButton className={classes.closeButton} onClick={()=> setIsOpen(false)}>
                    <CloseIcon/>
                </IconButton>


                <h2>Change chat:</h2>


                <form>
                    <input type="text" value={newChat} onChange={(e)=>{setNewChat(e.target.value)}} />
                    <button onClick={handleChangeChat} style={{display:'none'}}></button>
                </form>


                <Button className={classes.changeButton} onClick={handleChangeChat}>
                    Change chat
                </Button>

            </div>
        </CSSTransition>
        {/* END OF ADMIN CONTAINER */}
        </div>
     );
}
 
export default ChangeChat;