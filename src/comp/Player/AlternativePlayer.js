
import Iframe from 'react-iframe'

const AlternativePlayer = ({currentVideoLink}) => {



    return ( 
        <Iframe 
        url={currentVideoLink}
        width="100%"
        height="100%"
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