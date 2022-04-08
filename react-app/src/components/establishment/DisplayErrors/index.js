import React from 'react';
import { useSelector } from 'react-redux';
import style from './DisplayErrors.module.css'

const DisplayErrors = ({setShowErrorsModal}) => {
    const errors = useSelector(state => state.errors)
    return(
        <div id={style.error_container}>
            <ul>
                {errors.map(error => {
                    return(
                        <li key={error}>{error}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default DisplayErrors
