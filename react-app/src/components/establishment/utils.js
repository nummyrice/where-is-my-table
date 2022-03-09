
// NEW GUEST
export const newGuestFetch = async (name, notes, phone, email) => {

}


// UPDATE GUEST
export const updateGuestFetch = async (guestId, name, notes, phone, email) => {

}

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
        const data = await response.json()
        return data;
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
    const data = await response.json()
    return data;
}
