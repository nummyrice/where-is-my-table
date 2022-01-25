// NEW PARTY
export const newWaitlistFetch = async (guestId, partySize, estimatedWait, tags) => {
    const newParty = {
        guest_id: guestId,
        party_size: partySize,
        estimated_wait: estimatedWait
    }
    const response = await fetch('/api/waitlist/new', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newParty)
    })
    const data = await response.json()
    return data;
}

//UPDATE PARTY


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


//UPDATE GUEST
export const updateGuestFetch = async (guestId, name, notes, phone, email) => {
    const guestToUpdate = {
        id: guestId,
        name: name,
        email: email,
        notes: notes,
        phone_number: phone
    }
    // then post update guest
    const response = await fetch('/api/guests/update', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(guestToUpdate)
    })
    const data = await response.json()
    return data;
}
