import React from 'react';
import style from './utils.module.css';

function AlertBubble({message}) {
    return(
        <div className={`${style.box} ${style.sb12}`}>
            {message}
        </div>
    )
}

export default AlertBubble;
