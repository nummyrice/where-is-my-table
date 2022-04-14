import React, {useEffect} from 'react'
import { useParams } from 'react-router-dom'

const GuestResAccess = () => {
    const { establishmentName, id} = useParams()
    useEffect(() => {

    }, [])
    return(
        <div>
            <h1>{establishmentName}</h1>

        </div>
    )
}

export default GuestResAccess
