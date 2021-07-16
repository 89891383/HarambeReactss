import { makeStyles } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import "./CustomPlayer.css"


const useStyles = makeStyles({
    playButton:{
        fontSize:'150px',
    }
})

const CenterPlayButton = () => {

    const classes = useStyles()

    return (

            <div className="centerPlayButton">
                <PlayArrowIcon className={classes.playButton} />
            </div>

        
     );
}
 
export default CenterPlayButton;