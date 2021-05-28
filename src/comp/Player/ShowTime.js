import React, { useEffect } from 'react';
import { useState } from 'react';
const ShowTime = ({time}) => {
    const [cursorX, setCursorX] = useState(-1000)

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

    const {hours,minutes, seconds} = time

    return ( 
        <div className="showTime" style={{transform:`translate(${cursorX-100}px, -150%)`}} >
            {`${hours}:${minutes}:${seconds}`}
        </div>
     );
}
 
export default ShowTime;