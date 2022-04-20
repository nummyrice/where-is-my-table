import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import style from './GuestWaitlist.module.css'

const GuestWaitlist = () => {
    const { establishmentName, id} = useParams()
    const initialWaitlistData = {
        "waitlist_count": 0,
        "estimated_wait": 0,
        "place": null
    }
    const [waitlistData, setWaitlistData] = useState(initialWaitlistData)
    useEffect(() => {
        fetch(`/api/waitlist/${establishmentName}/${id}/waitlist-details`)
            .then(async res => {
                const data = await res.json()
                if (!res.ok) return data
                setWaitlistData(data)
            })
    }, [])

    const mockWaitlist = Array(waitlistData.waitlist_count).fill(0)
    return(
        <>
            <div id={style.paper_list}>
                <p>{"Current Waitlist"}</p>
                <div id={style.scroll_box}>
                    {mockWaitlist.map(party => {
                        return(
                            <div></div>
                        )
                    })
                    }
                </div>
            </div>
            <div id={style.box} className={style.gradient_border}>
                <h1>{`Join ${establishmentName}'s Waitlist`}</h1>
                <p>{`Estimated wait: ${waitlistData.estimated_wait} minutes`}</p>
                <p>{`There are ${waitlistData.waitlist_count} guests ahead of you.`}</p>
                <div>{"Add to Waitlist"}</div>
                <div>{"Remove from Waitlist"}</div>
            </div>
        </>
    )
}

export default GuestWaitlist
