
import Iframe from 'react-iframe'

const AlternativePlayer = ({currentVideoLink}) => {


    return ( 
        <Iframe 
        url={currentVideoLink || 'https://chaturbate.com/fullvideo/?tour=dU9X&signup_notice=0&campaign=x7eJU&disable_sound=0'}
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