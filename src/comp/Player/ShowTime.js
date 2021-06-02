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

    

    if(!time) return false

    const showTimeWidth = showTimeRef?.current?.getBoundingClientRect().width

    const {hours,minutes, seconds} = time

    return ( 
        <div className="showTime" ref={showTimeRef} style={{transform:`translate(${cursorX - showTimeWidth/2}px, -150%)`}} >
            {`${hours}:${minutes}:${seconds}`}
        </div>
     );
}
 
export default ShowTime;