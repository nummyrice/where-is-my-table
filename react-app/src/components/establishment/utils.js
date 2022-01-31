
// NEW GUEST
export const newGuestFetch = async (name, notes, phone, email) => {
    const newGuest = {
        name: name,
        notes: notes,
        phone_number: phone,
        email: email
    }
    const response = await fetch('/api/guests/add', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newGuest)
    })
    const data = await response.json();
    return data;
}


// UPDATE GUEST
export const updateGuestFetch = async (guestId, name, notes, phone, email) => {
    const guestToUpdate = {
        id: guestId,
        name: name,
        email: email,
        notes: notes,
        phone_number: phone
    }

    console.log('WAITLIST DETAILS: ', guestToUpdate)

    // then post update guest
    const response = await fetch('/api/guests/update', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(guestToUpdate)
    })
    const data = await response.json()
    return data;
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
