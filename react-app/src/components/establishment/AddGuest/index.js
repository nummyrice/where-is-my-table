import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import style from "./AddGuest.module.css";
import {ReactComponent as CheckCircle} from './assets/check-circle-solid.svg';
import {ReactComponent as Circle} from  './assets/circle-regular.svg';
import {ReactComponent as EditIcon} from './assets/edit-regular.svg';
// import {ReactComponent as X} from '../AddReservation/assets/times-solid.svg';
// import validator from 'validator';

const AddGuest = ({selectDateIndex, selectTimeIndex, partySize}) => {
    const sevenDayAvailability = useSelector((state) => state.sevenDayAvailability);
    const [displayDetails, setDisplayDetails] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [selectedGuest, setSelectedGuest] = useState();
    const [searchResults, setSearchResults] = useState([]);

    // edit buttons
    const [editNameField, setEditNameField] = useState(false);
    const [editNumberField, setEditNumberField] = useState(false);
    const [editEmailField, setEditEmailField] = useState(false);
    const [editNotesField, setEditNotesField] = useState(false);
    const [editTagsField, setEditTagsField] = useState(false);

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

    console.log('DATE INDEX : ', selectDateIndex)
    console.log('TIME INDEX : ', selectTimeIndex)
    console.log('PARTY: ', partySize)

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
        handleSearch()
    }, [handleSearch])

    const handleNameSelect = (guest) => {
        setSelectedGuest(guest)
        setSearchInput(guest.name)
    }

    // new guest validate
    const validateNewGuest = () => {
        const errors = [];
        if (!selectedGuest && !name) {
            let trimmedName = name.trim();
            if (trimmedName.length > 40 || trimmedName.length < 1) errors.push("name must be greater than one and less than forty characters");
        };
        if (!selectedGuest && !tags) {
            const tagArray = tags.split('');
            if (tagArray.some((tag) => {
                let trimmedTag = tag.trim()
                return trimmedTag.length > 40
            })) {
                errors.push("individual tags must be less than forty characters and seperated by spaces")
            };
        };
        if (!selectedGuest && !notes) {
            let trimmedNotes = notes.trim();
            if (trimmedNotes.length > 500) errors.push("notes must be less than five-hundred characters");
        };
        if (!selectedGuest && !phoneNumber) {
            let trimmedPhone = phoneNumber.replace(/\D/g,'');
            if (trimmedPhone.length < 10 || trimmedPhone.length > 11) errors.push("phone numbers must only include numbers and must be include area code");
        };
        if (!selectedGuest && !email) {
            if (!String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) {
                errors.push("email must follow standard format")
            }
        };
        console.log(errors);
        return errors;
    }


    // guest update validate
    const validateGuestUpdate = () => {
        const errors = [];
        if (selectedGuest && editNameField) {
            let trimmedName = name.trim();
        if (trimmedName.length > 40 || trimmedName.length < 1) errors.push("name must be greater than one and less than forty characters");
        };
        if (selectedGuest && editTagsField) {
            const tagArray = tags.split('');
        if (tagArray.some((tag) => {
            let trimmedTag = tag.trim()
            return trimmedTag.length > 40
        })) {
            errors.push("individual tags must be less than forty characters and seperated by spaces")
        };
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
        return errors;
    }

    const validateDate = () => {
        const errors = [];
        if (new Date(sevenDayAvailability[selectDateIndex].availability[selectTimeIndex].datetime).getTime() < new Date().getTime()) errors.push("reservation time has already passed, please adjust your date and/or time")
        return errors;
    }
    const validateNameAndPhone = () => {
        const errors = [];
        let trimmedName = name.trim();
        if (trimmedName.length > 40 || trimmedName.length < 1) errors.push("name must be greater than one and less than forty characters");
        let trimmedPhone = phoneNumber.replace(/\D/g,'');
        if (trimmedPhone.length < 10 || trimmedPhone.length > 11) errors.push("phone numbers must only include numbers and must be include area code");
        return errors.length < 1
    }

    const handleSubmit = () => {

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
                        setEditTagsField(false);
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
                        <div className={style.tags_block}>
                            <label>TAGS</label>
                            {selectedGuest && !editTagsField &&
                            <>
                                <div className={style.guest_tags}>{selectedGuest.tags.map((tag, index) => {
                                    return(
                                        <div key={index} className={style.guest_tag}>{tag.name}</div>
                                    )
                                })}</div>
                                <EditIcon onClick={()=>{
                                    setEditTagsField(true)
                                    //add tags hook here
                                    }}className={style.edit_icon}/>
                            </>}
                            {selectedGuest && editTagsField &&
                            <>
                                <div className={style.guest_tags}>{selectedGuest.tags.map((tag, index) => {
                                    return(
                                        <>
                                            <div key={index} className={style.guest_tag}>{tag.name}</div>
                                            <div className={style.guest_tag_delete}>X</div>
                                        </>
                                    )
                                })}</div>
                                <input  value={tags} placeholder={"enter tags seperated by a space"} onChange={(e)=>{setTags(e.target.value)}} className={style.tag_input}></input>
                            </>}
                            {!selectedGuest &&<input value={tags} onChange={(e)=>{setTags(e.target.value)}} placeholder={"enter tags seperated by a space"} className={style.tag_input}></input>}
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

                </form>}
                {(selectedGuest || validateNameAndPhone()) && <div  onClick={() => {
                    const errors = validateGuestUpdate().concat( validateNewGuest(), validateDate());
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
                                <div onClick={()=>{
                                        handleSubmit()
                                        }} className={style.confirm_button}>Confirm Reservation</div>
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
