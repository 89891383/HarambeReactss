import { useDispatch } from "react-redux";
import { loadPlayer } from "../../redux/playerState";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Box, Container, makeStyles, Typography } from "@material-ui/core";


const useStyles = makeStyles({
    playIcon:{
        fontSize:'150px',
    },
    box:{
        width:'fit-content',
        padding:'5px',
        borderRadius:'5px',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        transition:'300ms',
        fontWeight:'700',
        cursor:'pointer',
        zIndex:2,
        backgroundColor:'rgba(255, 255, 255, 0.15)',
        '&:hover':{
            backgroundColor:'rgba(255, 255, 255, 0.3);',
        }
    },
    container:{
        backgroundColor:'black',
        width:'100%',
        height:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        gap:'10px',
    }
})

const ClickToLoad = () => {

    const classes = useStyles()

    const dispatch = useDispatch()

    const handleClick = ()=>{
        dispatch(loadPlayer())
    }

    return (
        <Container className={classes.container}>
            <Box className={classes.box} onClick={handleClick}>
                <PlayArrowIcon className={classes.playIcon} />
            </Box>
            <Typography variant="h4" >
                Click to start 
            </Typography>
        </Container>
       
     );
}
 
export default ClickToLoad;