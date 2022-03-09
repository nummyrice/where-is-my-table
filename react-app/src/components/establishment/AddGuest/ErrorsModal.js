import React from 'react';

const ErrorsModal = ({errors, setErrors}) => {
    return(
        <div>
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

export default ErrorsModal
