// TAGS
//add tags to reservation
 export const postTags = async (reservationId, tags) => {
        const newTags = {
            reservation_id: reservationId,
            tags: tags
        }
        const response = await fetch('/api/tags/add-to-reservation', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(newTags)
        })
        return response;
}


//add tags to waitlist
export const postPartyTags = async (waitlistId, tags) => {
    const newTags = {
        waitlist_id: waitlistId,
        tags: tags
    }
    const response = await fetch('/api/tags/add-to-waitlist', {
        method: 'POST',
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify(newTags)
    })
    return response;
}
