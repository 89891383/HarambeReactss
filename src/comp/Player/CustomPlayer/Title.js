import { Box, makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
    box:{
        position:'absolute',
        top:'15px',
        left:'15px',
        padding:'10px',
        maxWidth:'90%',
        borderRadius:'5px',
        display:'flex',
        transition:'300ms',
        '&:hover':{
            backgroundColor:'rgba(255, 255, 255, 0.3);'
        }
    }
})

const Title = () => {

    const classes = useStyles()

    const {videoTitle} = useSelector(state=> state.player)

    return ( 
            <Box className={classes.box} >
                <Typography variant="h4" noWrap>
                    {videoTitle}
                </Typography>
            </Box>
     );
}
 
export default Title;