import { useContext } from 'react';
import Iframe from 'react-iframe'
import { useCss, useIdle } from 'react-use';
import { DataContext } from '../../App';


const AlternativePlayer = ({currentVideoLink}) => {

    const { videoTitle } = useContext(DataContext)

   const iframePlayer = useCss({
            width:'100%',
            height:'100%',
    })

    const isIdle = useIdle(3000)

    
    return (
        <div className={iframePlayer}>
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
                position="relative"
            />
             {videoTitle && !isIdle && <div className="videoTitlePlayer">{videoTitle}</div>}
        </div> 
 
        	
     );
}
 
export default AlternativePlayer;