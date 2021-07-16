import { useDispatch } from "react-redux";
import { loadPlayer } from "../../redux/playerState";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles({
    playIcon:{
        fontSize:'150px',
    }
})

const ClickToLoad = () => {

    const classes = useStyles()

    const dispatch = useDispatch()

    const handleClick = ()=>{
        dispatch(loadPlayer())
    }

    return ( 
        <div className="clickToLoad" onClick={handleClick}>
            <PlayArrowIcon className={classes.playIcon} />
            Click to start 
        </div>
     );
}
 
export default ClickToLoad;