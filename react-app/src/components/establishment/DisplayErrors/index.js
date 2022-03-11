import React from 'react';
import style from './DisplayErrors.module.css'

const DisplayErrors = ({errors}) => {
    return(
        <div id={style.error_container}>
            <ul>
                {errors.map(error => {
                    return(
                        <li>{error}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default DisplayErrors