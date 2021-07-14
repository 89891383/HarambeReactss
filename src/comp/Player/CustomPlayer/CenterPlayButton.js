import { makeStyles } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import "./CustomPlayer.css"


const useStyles = makeStyles({
    playButton:{
        fontSize:'150px',
        textShadow:'0 0 15px #111',
    }
})

const CenterPlayButton = () => {

    const classes = useStyles()

    return (

            <div className="playVideo">
                <PlayArrowIcon className={classes.playButton} />
            </div>

        
     );
}
 
export default CenterPlayButton;