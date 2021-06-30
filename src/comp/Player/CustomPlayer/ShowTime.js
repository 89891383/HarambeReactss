import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
const ShowTime = ({time}) => {
    const [cursorX, setCursorX] = useState(-1000)
    const showTimeRef = useRef(null)

    const handleFollowCursor = (e) =>{
        setCursorX(e.clientX)
    }

    useEffect(()=>{
        document.addEventListener('mousemove', handleFollowCursor)
        return ()=>{
        document.removeEventListener('mousemove', handleFollowCursor)
        }
    },[])


    const maxWidth = document.querySelector('.customPlayer').getBoundingClientRect().width

    


    if(!time) return false

    const showTimeWidth = showTimeRef?.current?.getBoundingClientRect().width

    const {hours,minutes, seconds} = time

    let calculateTranslate  = cursorX - showTimeWidth/2 - 10

    
    if(showTimeWidth/2 + 2 + cursorX > maxWidth){
        calculateTranslate = maxWidth - showTimeWidth - 15
    }else if(cursorX < showTimeWidth/2  ){
        calculateTranslate = -15
    }

    return ( 
        <div className="showTime" ref={showTimeRef} style={{transform:`translate(${calculateTranslate}px, -150%)`}} >
            {`${hours}:${minutes}:${seconds}`}
        </div>
     );
}
 
export default ShowTime;