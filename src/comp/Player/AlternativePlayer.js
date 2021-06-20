
import Iframe from 'react-iframe'

const AlternativePlayer = ({currentVideoLink}) => {


    return ( 
        <Iframe 
        url={currentVideoLink}
        width=""
        height="97%"
        styles={{overflow:'hidden'}}
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        allow-popouts="no"
        display="initial"
        position="relative"/>
        	
     );
}
 
export default AlternativePlayer;