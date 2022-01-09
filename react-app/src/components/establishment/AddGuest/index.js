import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import style from "./AddGuest.module.css";
import {ReactComponent as CheckCircle} from './assets/check-circle-solid.svg';
import {ReactComponent as Circle} from  './assets/circle-regular.svg';
import {ReactComponent as EditIcon} from './assets/edit-regular.svg';
// import {ReactComponent as X} from '../AddReservation/assets/times-solid.svg';
// import validator from 'validator';

const AddGuest = ({editReservation, setEditReservation, setShowMakeRes, selectDateIndex, selectTimeIndex, partySize}) => {
    const sevenDayAvailability = useSelector((state) => state.sevenDayAvailability);
    const [displayDetails, setDisplayDetails] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [selectedGuest, setSelectedGuest] = useState(editReservation.guest_info || 0);
    const [searchResults, setSearchResults] = useState([]);

    // edit buttons
    const [editNameField, setEditNameField] = useState(false);
    const [editNumberField, setEditNumberField] = useState(false);
    const [editEmailField, setEditEmailField] = useState(false);
    const [editNotesField, setEditNotesField] = useState(false);

    // controlled inputs
    const [name, setName] = useState('');
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    // errors
    const [errors, setErrors] = useState([]);

    // confirm modal
    const [showModal, setShowModal] = useState(false);

    // console.log('DATE INDEX : ', selectDateIndex)
    // console.log('TIME INDEX : ', selectTimeIndex)
    // console.log('PARTY: ', partySize)

    const handleSearch =  useCallback(async () => {
        const response = await fetch('/api/guests', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"search_string": searchInput})
        })

        const data = await response.json()
        setSearchResults(data.searchResults)
    }, [searchInput])

    useEffect(() => {
        if (editReservation) {
            setSelectedGuest(editReservation.guest_info)
        }
    }, [editReservation])

    useEffect(() => {
        handleSearch()
    }, [handleSearch])

    const handleNameSelect = (guest) => {
        setSelectedGuest(guest)
        setSearchInput(guest.name)
    }

    // new guest validate
    const validateNewGuest = () => {
        const errors = [];
        if (!selectedGuest && name) {
            let trimmedName = name.trim();
            if (trimmedName.length > 40 || trimmedName.length < 1) errors.push("name must be greater than one and less than forty characters");
        };
        if (!selectedGuest && notes) {
            let trimmedNotes = notes.trim();
            if (trimmedNotes.length > 500) errors.push("notes must be less than five-hundred characters");
        };
        if (!selectedGuest && phoneNumber) {
            let trimmedPhone = phoneNumber.replace(/\D/g,'');
            if (trimmedPhone.length < 10 || trimmedPhone.length > 11) errors.push("phone numbers must only include numbers and must be include area code");
        };
        if (!selectedGuest && email) {
            if (!String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) {
                errors.push("email must follow standard format")
            }
        };

        return errors;
    }


    // guest update validate
    const validateGuestUpdate = () => {
        const errors = [];
        if (selectedGuest && editNameField) {
            let trimmedName = name.trim();
        if (trimmedName.length > 40 || trimmedName.length < 1) errors.push("name must be greater than one and less than forty characters");
        };
        if (selectedGuest && editNotesField) {
            let trimmedNotes = notes.trim();
        if (trimmedNotes.length > 500) errors.push("notes must be less than five-hundred characters");
        };
        if (selectedGuest && editNumberField) {
            let trimmedPhone = phoneNumber.replace(/\D/g,'');
            if (trimmedPhone.length < 10 || trimmedPhone.length > 11) errors.push("phone numbers must only include numbers and must be include area code");
        };
        if (selectedGuest && editEmailField) {
            if (!String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            errors.push("email must follow standard format")
        };
        };
        console.log('update errors', errors)
        return errors;
    }

    const validateDate = () => {
        const errors = [];
        if (new Date(sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime).getTime() < new Date().getTime()) errors.push("reservation time has already passed, please adjust your date and/or time")
        console.log('date errors', errors)
        return errors;
    }
    const validateNameAndPhone = () => {
        const errors = [];
        let trimmedName = name.trim();
        if (trimmedName.length > 40 || trimmedName.length < 1) errors.push("name must be greater than one and less than forty characters");
        let trimmedPhone = phoneNumber.replace(/\D/g,'');
        if (trimmedPhone.length < 10 || trimmedPhone.length > 11) errors.push("phone numbers must only include numbers and must be include area code");
        return errors.length < 1;
    }

    const validateTags = () => {
        const errors = [];
        const tagArray = tags.split('');
        if (tagArray.some((tag) => {
            let trimmedTag = tag.trim()
            return trimmedTag.length > 40
        })) {
            errors.push("individual tags must be less than forty characters and seperated by spaces")
        };
        return errors;
    }

    const postTags = async (reservationId) => {
        const newTags = {
            reservation_id: reservationId,
            tags: tags
        }
        const response = await fetch('/api/tags/add', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(newTags)
        })
        const data = await response.json()
        if (data.result) {
            return data
        }
        setErrors(data.errors)
        return data
    }
    // handle update
    const handleUpdate = async () => {
        // if editReservation
        // if guest is selected
        if (selectedGuest) {
            // if guest fields were edited
            if (editEmailField || editNameField || editNumberField || editNotesField) {
                const guestToUpdate = {
                    id: selectedGuest.id,
                    name: name,
                    email: email,
                    notes: notes,
                    phone_number: phoneNumber
                }
                // then post update guest
                const response = await fetch('/api/guests/update', {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(guestToUpdate)
                })
                const data = await response.json()
                   // if update is success
                if (data.result) {
                    const resToUpdate = {
                        reservation_id: editReservation.id,
                        guest_id: selectedGuest.id,
                        reservation_time: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime,
                        party_size: partySize,
                        table_id: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].table.id
                    }
                    const updateResponse = await fetch('/api/reservations/update', {
                        method: 'PUT',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(resToUpdate)
                    })
                    const resUpdateData = await updateResponse.json()

                    if (resUpdateData.result) {
                        return resUpdateData;
                    }
                    setErrors(resUpdateData.errors)
                    return resUpdateData;
                }
                setErrors(data.errors)
                return data;
            } else {
                const resToUpdate = {
                    reservation_id: editReservation.id,
                    guest_id: selectedGuest.id,
                    reservation_time: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime,
                    party_size: partySize,
                    table_id: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].table.id
                }
                const updateResponse = await fetch('/api/reservations/update', {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(resToUpdate)
                })
                const resUpdateData = await updateResponse.json()

                if (resUpdateData.result) {
                    return resUpdateData;
                }
                setErrors(resUpdateData.errors)
                return resUpdateData;
            }
        } else {
            const newGuest = {
                name: name,
                notes: notes,
                phone_number: phoneNumber,
                email: email
            }
            // post new guest
            const response = await fetch('/api/guests/add', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newGuest)
            })
            const data = await response.json();
            if (data.result) {
                const updateRes = {
                    reservation_id: editReservation.id,
                    guest_id: data.guest.id,
                    reservation_time: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime,
                    party_size: partySize,
                    table_id: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].table.id
                }
                //then post reservation
                const resResponse = await fetch('/api/reservations/update', {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(updateRes)
                })
                const resUpdateData = await resResponse.json()
                if (resUpdateData.result) {
                    // if (tags) {
                    //     return postTags(resUpdateData.newReservation.id);
                    // }
                    return resUpdateData.newReservation
                }
                setErrors(resUpdateData.errors);
                return resUpdateData;
            }
            console.log('not getting a success result', data)
            setErrors(data.errors);
            return data;
        }

    }
                // update selected reservation with date/time/tags/party that changed
            // if guest is not selected
                // create new guest with info entered
                // update reservation with the new guest and date/time/tags/party if changed

    const handleSubmit = async () => {
        // if guest is selected but none of the edits are present
        if (selectedGuest && !editEmailField && !editNameField && !editNumberField && !editNotesField) {
            const newReservation = {
                guest_id: selectedGuest.id,
                reservation_time: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime,
                party_size: partySize,
                table_id: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].table.id
            }
            //then post reservation
            const response = await fetch('/api/reservations/new', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newReservation)
            })
            const data = await response.json()
            if (data.result) {
                if (tags) {
                    return postTags(data.newReservation.id)
                }
                return data.newReservation
            }
            setErrors(data.errors);
            return data
        }
        // if guest is selected and any edit is present
        if (selectedGuest && (editEmailField || editNameField || editNumberField || editNotesField)) {
            const guestToUpdate = {
                id: selectedGuest.id,
                name: name,
                email: email,
                notes: notes,
                phone_number: phoneNumber
            }
            // then post update guest
            const response = await fetch('/api/guests/update', {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(guestToUpdate)
            })

            const data = await response.json()
            // if update is success
            if (data.result) {
                const newReservation = {
                    guest_id: selectedGuest.id,
                    reservation_time: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime,
                    party_size: partySize,
                    table_id: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].table.id
                }
                //then post reservation
                const response = await fetch('/api/reservations/new', {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newReservation)
                })
                const data = await response.json()
                if (data.result) {
                    if (tags) {
                        return postTags(data.newReservation.id)
                    }
                    return data.newReservation
                }
                setErrors(data.errors);
                return data

            }
            setErrors(data.errors);
            return data
        }
        // if not guest is selected
        if (!selectedGuest) {
            const newGuest = {
                name: name,
                notes: notes,
                phone_number: phoneNumber,
                email: email
            }
            // post new guest
            const response = await fetch('/api/guests/add', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newGuest)
            })
            const data = await response.json();
            if (data.result) {
                const newReservation = {
                    guest_id: data.guest.id,
                    reservation_time: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime,
                    party_size: partySize,
                    table_id: sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].table.id
                }
                //then post reservation
                const resResponse = await fetch('/api/reservations/new', {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newReservation)
                })
                const reservationData = await resResponse.json()
                if (reservationData.result) {
                    if (tags) {
                        return postTags(reservationData.newReservation.id);
                    }
                    return reservationData.newReservation
                }
                setErrors(reservationData.errors);
                return reservationData;
            }
            console.log('not getting a success result', data)
            setErrors(data.errors);
            return data;
        }
        const uknownError = {"errors": ["not hitting any handleSubmit conditions"]}
        setErrors(uknownError.errors)

        return uknownError
    }

    return(
        <div className={style.add_guest}>
            <div className={style.guest_search_and_details}>
                <div className={style.guest_tabs}>
                    <div onClick={() => {setDisplayDetails(true)}} className={displayDetails ? style.guest_details_tab_on : style.guest_details_tab}>
                        <div className={style.details_text}>Details</div>
                        {displayDetails && <CheckCircle className={style.details_check}></CheckCircle>}
                        {!displayDetails && <Circle className={style.details_check}></Circle>}
                    </div>
                    <div onClick={(e) => {setDisplayDetails(false)}} className={!displayDetails ? style.guest_search_tab_on : style.guest_search_tab}>
                        <div className={style.guest_text}>Guest</div>
                        {displayDetails && <Circle className={style.guest_check}></Circle>}
                        {!displayDetails && <CheckCircle className={style.guest_check}></CheckCircle>}
                    </div>
                </div>
                {!displayDetails &&
                <>
                <input value={searchInput} placeholder={'search by phone or name'} onChange={(e) => {setSearchInput(e.target.value)}} className={style.guest_search_field}></input>
                {selectedGuest && <div className={style.selected_guest}>
                    <div className={style.selected_guest_name}>{selectedGuest.name}</div>
                    <div onClick={()=>{
                        setSelectedGuest(undefined);
                        setEditNameField(false);
                        setEditNumberField(false);
                        setEditEmailField(false);
                        setEditNotesField(false);
                        setName('');
                        setTags('');
                        setNotes('');
                        setPhoneNumber('');
                        setEmail('');
                        }} className={style.x_button}>x</div>
                    </div>}
                {!selectedGuest && <div className={style.search_results}>{searchResults.length > 0 && searchResults.map((guest, index)=> {
                    return(
                        <div key={index} onClick={()=> handleNameSelect(guest)} className={style.searched_guest}>{guest.name}</div>
                    )
                })}</div>}
                </>
                }
                {displayDetails &&
                <form className={style.details_form}>
                    <div className={style.form_title}>{selectedGuest ? "Edit Guest" : "New Guest"}</div>
                    <div className={style.details_inputs}>
                        <div className={style.name_block}>
                            <label>NAME</label>
                            {selectedGuest && !editNameField &&
                            <>
                                <div className={style.guest_name}>{selectedGuest.name}</div>
                                <EditIcon onClick={()=>{
                                    setEditNameField(true)
                                    setName(selectedGuest.name)
                                    }} className={style.edit_icon}/>
                            </>}
                            {selectedGuest && editNameField &&
                            <>
                                <input onChange={(e) => {setName(e.target.value)}} value={name} className={style.guest_name}></input>
                            </>}
                            {!selectedGuest && <input onChange={(e) => {setName(e.target.value)}} value={name} className={style.name_input}></input>}
                        </div>
                        <div className={style.notes_block}>
                            <label>NOTES</label>
                            {selectedGuest && !editNotesField &&
                            <>
                                <div className={style.guest_notes}>{selectedGuest.notes}</div>
                                <EditIcon onClick={()=>{
                                    setEditNotesField(true)
                                    setNotes(selectedGuest.notes)
                                }} className={style.edit_icon}/>
                            </>}
                            {selectedGuest && editNotesField &&
                            <>
                                <input onChange={(e) => {setNotes(e.target.value)}} value={notes} className={style.notes_input}></input>
                            </>}
                            {!selectedGuest  && <input onChange={(e) => {setNotes(e.target.value)}} value={notes} className={style.notes_input}></input>}
                        </div>
                        <div className={style.contact_label}>Contact Info</div>
                        <div className={style.phone_block}>
                            <label>Mobile Number</label>
                            {selectedGuest && !editNumberField &&
                            <>
                                <div className={style.guest_phone}>{selectedGuest.phone_number}</div>
                                <EditIcon onClick={()=>{
                                    setEditNumberField(true)
                                    setPhoneNumber(selectedGuest.phone_number)
                                    }} className={style.edit_icon}/>
                            </>}
                            {selectedGuest && editNumberField &&
                            <>
                                <input value={phoneNumber} onChange={(e) => {setPhoneNumber(e.target.value)}} className={style.phone_input}></input>
                            </>}
                            {!selectedGuest && <input onChange={(e) => {setPhoneNumber(e.target.value)}} value={phoneNumber} className={style.phone_input}></input>}
                        </div>
                        <div className={style.email_block}>
                            <label>Email</label>
                            {selectedGuest && !editEmailField &&
                            <>
                                <div className={style.guest_email}>{selectedGuest.email}</div>
                                <EditIcon onClick={()=>{
                                    setEditEmailField(true)
                                    setEmail(selectedGuest.email)
                                    }} className={style.edit_icon}/>
                            </>}
                            {selectedGuest && editEmailField &&
                            <>
                                <input onChange={(e) => {setEmail(e.target.value)}} value={email} className={style.email_input}></input>
                            </>}
                            {!selectedGuest && <input onChange={(e) => {setEmail(e.target.value)}} value={email} className={style.email_input}></input>}
                        </div>
                    </div>
                    <div className={style.tag_section}>
                        <div className={style.tag_section_title}> Reservation Tags</div>
                        <div className={style.tags_block}>
                            <label>TAGS</label>
                            <input  value={tags} placeholder={"enter tags seperated by a space"} onChange={(e)=>{setTags(e.target.value)}} className={style.tag_input}></input>
                        </div>
                    </div>
                </form>}
                {(selectedGuest || validateNameAndPhone()) && editReservation &&
                <div  onClick={() => {
                    const errors = validateGuestUpdate().concat( validateNewGuest(), validateDate(), validateTags());
                    setErrors(errors);
                    setShowModal(true);
                    }} className={style.place_reservation_button}>{'Update Reservation'}</div>
                }
                {((selectedGuest || validateNameAndPhone()) && !editReservation) && <div  onClick={() => {
                    const errors = validateGuestUpdate().concat( validateNewGuest(), validateDate(), validateTags());
                    setErrors(errors);
                    setShowModal(true);
                    }} className={style.place_reservation_button}>{'Reserve Table'}</div>}
                {(!selectedGuest && !validateNameAndPhone()) && <div className={style.disabled_reservation_button}>{'Please add a guest'}</div>}
                {showModal && <div className={style.modal_background}>
                        <div className={style.error_submission_modal}>
                            <div className={style.title_bar}>{errors.length < 1 ? "Confirm Reservation" : "It seems there is an issue..."}</div>
                            {!errors.length && <ul className={style.reservation_details}>
                                <li>Your reservation:</li>
                                <li>{`${partySize} ${partySize === 1 ? 'Guest' : 'Guests'}`}</li>
                                <li>{`at ${new Date(sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime).toLocaleTimeString('en-Us', { hour: 'numeric', minute: '2-digit' })}`}</li>
                                <li>{`on ${new Date(sevenDayAvailability[selectDateIndex].date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`}</li>
                                <li> {`for ${selectedGuest ? selectedGuest.name : name}`}</li>
                                </ul>}
                            {errors.length && <div className={style.errors}>
                                <div className={style.error_message}></div>
                                {errors.map((error)=>{
                                    return(
                                        <>
                                        <div className={style.error_description}>{error}</div>
                                        </>
                                    )
                                })}
                                </div>}
                                {!errors.length && <div className={style.button_area}>
                                {editReservation && <div onClick={async ()=>{
                                        const result = await handleUpdate();
                                        if (result.errors) {
                                        }
                                        else {
                                            setShowModal(false)
                                            setEditReservation('')
                                        }
                                        }} className={style.confirm_button}>Confirm Reservation</div>}
                                {!editReservation && <div onClick={async ()=>{
                                        const result = await handleSubmit();
                                        if (result.errors) {
                                        }
                                        else {
                                            setShowModal(false)
                                            setShowMakeRes(false)
                                        }
                                        }} className={style.confirm_button}>Confirm Reservation</div>}
                                <div onClick={()=>{
                                        setShowModal(false)
                                        setErrors([])}} className={style.return_button}>Return</div>
                                    </div>}
                            {errors.length && <div className={style.button_area}>
                                    <div onClick={()=>{
                                        setShowModal(false)
                                        setErrors([])}} className={style.return_button}>Return</div>
                                </div>}
                        </div>
                    </div>}
            </div>
        </div>
    )
}

export default AddGuest;
