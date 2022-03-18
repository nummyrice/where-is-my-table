import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import style from "./AddGuest.module.css";
import {ReactComponent as CheckCircle} from './assets/check-circle-solid.svg';
import {ReactComponent as Circle} from  './assets/circle-regular.svg';
import {ReactComponent as EditIcon} from './assets/edit-regular.svg';
import {ReactComponent as DeleteTag} from '../AddReservation/assets/times-solid.svg';
import { removeTag } from '../../../store/reservations';
import { removePartyTag } from '../../../store/selectedDateWaitlist';
import { Modal } from '../../../context/Modal';
import { setErrors } from '../../../store/errors';
import AlertBubble from '../../utils/AlertBubble';
// import {ReactComponent as X} from '../AddReservation/assets/times-solid.svg';
// import validator from 'validator';

const AddGuest = ({editWaitlist, showAddWaitlist, selectedGuest, setSelectedGuest, setShowConfirmParty, setShowConfirmRes, showErrorsModal, setShowErrorsModal, visitTags, newVisitTags, setNewVisitTags, handleRemoveVisitTag, bookRes}) => {
    const dispatch = useDispatch()
    const [displayDetails, setDisplayDetails] = useState(false);
    const [searchInput, setSearchInput] = useState("");
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

    // validation alerts
    const [showValidateNameBubble, setShowValidateNameBubble] = useState(false)
    const [showValidateNotesBubble, setShowValidateNotesBubble] = useState(false)
    const [showValidateTagsBubble, setShowValidateTagsBubble] = useState(false)
    const [showValidatePhoneBubble, setShowValidatePhoneBubble] = useState(false)
    const [showValidateEmailBubble, setShowValidateEmailBubble] = useState(false)
    const [submitStatus, setSubmitStatus] = useState('add guest')

    // searches for guests as user types
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
        setShowValidateNameBubble(false)
        setShowValidateNotesBubble(false)
        setShowValidateEmailBubble(false)
        setShowValidatePhoneBubble(false)
        setShowValidateTagsBubble(false)
        setSelectedGuest(guest)
        setSearchInput(guest.name)
    }

    const handleRemoveTag = async (reservationId, tagId) => {
        dispatch(removeTag(reservationId, tagId)).then((data)=>{
            console.log('DELETE TAG DISPATCH: ', data)
        });
    }

    const handleRemovePartyTag = async (waitlistId, tagId) => {
        dispatch(removePartyTag(waitlistId, tagId)).then((data)=>{
            console.log('DELETE TAG DISPATCH: ', data)
        });
    }

    const validateName = async () => {
        if (name === '') return setShowValidateNameBubble("name number is required");
        let trimmedName = name.trim();
        if (trimmedName.length > 40 || trimmedName.length < 1) return setShowValidateNameBubble("name must be greater than one and less than forty characters");
        const response = await fetch('/api/guests/validate-name', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name})
        })
        if (!response.ok) {
            dispatch(setErrors())
            showErrorsModal(true)
            return
        }
        const data = await response.json()
        console.log('test', data, !data.result)

        if (!data.result) {
            setShowValidateNameBubble("Please choose a different name.")
        } else {
            setShowValidateNameBubble(false)
            //TODO: set boarder to green and display a check
        }
    }

    const validateNotes = () => {
        let trimmedNotes = notes.trim();
        if (trimmedNotes.length > 500) setShowValidateNotesBubble(`Notes too long; ${trimmedNotes.length}/500`);
    }
    useEffect(() => {
        if (selectedGuest) {
            if ((editNameField || editNotesField || editNumberField || editEmailField) && (showValidateNameBubble || showValidateNotesBubble || showValidateTagsBubble || showValidatePhoneBubble || showValidateEmailBubble)) {
                return setSubmitStatus('add guest')
            }
            if (editWaitlist) return setSubmitStatus('update party');
            if (bookRes === 'new') return setSubmitStatus('submit res');
            if (showAddWaitlist) return setSubmitStatus('submit party')
            if (bookRes !== 'new') return setSubmitStatus('update res');
        } else {
            if (showValidateNameBubble || showValidateNotesBubble || showValidateTagsBubble || showValidatePhoneBubble || showValidateEmailBubble) {
                return setSubmitStatus('add guest')
            }
            if (!name || !phoneNumber) return setSubmitStatus('add guest')
            if (editWaitlist) return setSubmitStatus('update party')
            if (showAddWaitlist) return setSubmitStatus('submit party')
            if (bookRes === 'new') return setSubmitStatus('submit res');
            if (bookRes !== 'new') return setSubmitStatus('update res');
        }
    }, [bookRes, editEmailField, editNameField, editNotesField, editNumberField, editWaitlist, name, phoneNumber, selectedGuest, showAddWaitlist, showValidateEmailBubble, showValidateNameBubble, showValidateNotesBubble, showValidatePhoneBubble, showValidateTagsBubble])

    const validatePhone = async () => {
        if (phoneNumber === '') return setShowValidatePhoneBubble("phone number is required");
        let trimmedPhone = phoneNumber.replace(/\D/g,'');
        if (trimmedPhone.length < 10 || trimmedPhone.length > 11) {
            setShowValidatePhoneBubble("phone numbers must only include numbers and must be include area code");
            return;
        } else {
            const response = await fetch('/api/guests/validate-phone', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({phoneNumber})
            })
            const data = await response.json()
            if (!response.ok) {
                dispatch(setErrors(data.errors))
                showErrorsModal(true)
                return
            }
            if (!data.result) {
                setShowValidatePhoneBubble(data.message)
                return;
            }
            return data;
        }
    }

    const validateTags = () => {
        const tagArray = tags.split(',');
        if (tagArray.some((tag) => {
            let trimmedTag = tag.trim()
            return trimmedTag.length > 40
        })) {
            setShowValidateTagsBubble("each tag must be less than forty characters and seperated by a comma and spaces")
        };
        return;
        //TODO: set boarder to green
    }

    const validateEmail = async () => {
        if (email === '') return;
        if (!String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            return setShowValidateEmailBubble("incorrect email format");
        }
        const response = await fetch('/api/guests/validate-email', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email})
        })
        const data = await response.json()
        if (!response.ok) {
            dispatch(setErrors(data.errors))
            return
        }
        if (!data.result) {
            setShowValidateEmailBubble(data.message)
            return
        }
        return
    }

    const handleNewGuestSubmit = async () => {
        const newGuest = {
            name: name,
            notes: notes,
            phone_number: phoneNumber,
            email: email
        }
        const response = await fetch('/api/guests/add', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newGuest)
        })
        const data = await response.json();
        if (response.ok) {
            setSelectedGuest(data)
        }
    }

    const handleGuestUpdate = async () => {
        const guestToUpdate = {
            id: selectedGuest.id,
            name: name,
            email: email,
            notes: notes,
            phone_number: phoneNumber
        }
        console.log('guest to update: ', guestToUpdate)
        // then post update guest
        const response = await fetch('/api/guests/update', {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(guestToUpdate)
        })
        const data = await response.json()
        if (response.ok) {
            setSelectedGuest(data)
        }
    }

    const handleSubmitRouter = () => {
        if (selectedGuest && (editNameField || editEmailField || editNotesField || editNumberField)) {
            handleGuestUpdate()
            .then((res) => {
                if (bookRes) return setShowConfirmRes(true);
                if (showAddWaitlist || editWaitlist) return setShowConfirmParty(true);
            }).catch(err => {setErrors([...err]); setShowErrorsModal(true); console.log('error has occured, ', err)})
        } else if (selectedGuest) {
            if (bookRes) return setShowConfirmRes(true);
            if (showAddWaitlist || editWaitlist) return setShowConfirmParty(true);
        } else {
            handleNewGuestSubmit()
            .then((res) => {
                if (bookRes) return setShowConfirmRes(true);
                if (showAddWaitlist || editWaitlist) return setShowConfirmParty(true);
            }).catch(err => {
                setErrors([...err])
                setShowErrorsModal(true)
                console.log('error has occured, ', err)
            })
        }
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
                        setSelectedGuest(null);
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
                                <input onFocus={()=>setShowValidateNameBubble(false)} onBlur={validateName} onChange={(e) => {setName(e.target.value)}} value={name} className={style.guest_name}/>
                            }
                            {!selectedGuest && <input onFocus={()=>setShowValidateNameBubble(false)}  onBlur={validateName} onChange={(e) => {setName(e.target.value)}} value={name} className={style.name_input}/>
                            }
                            {showValidateNameBubble && <AlertBubble message={showValidateNameBubble}/>}
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
                                <textarea onFocus={()=>setShowValidateNotesBubble(false)} onBlur={validateNotes} onChange={(e) => {setNotes(e.target.value)}} value={notes} className={style.notes_input} name="notes" cols="20" rows="2"></textarea>
                            </>}
                            {!selectedGuest  &&
                                <textarea onFocus={()=>setShowValidateNotesBubble(false)}  onBlur={validateNotes} onChange={(e) => {setNotes(e.target.value)}} value={notes} className={style.notes_input} name="notes" cols="20" rows="2">
                                </textarea>
                            }
                            {showValidateNotesBubble && <AlertBubble message={showValidateNotesBubble}/>}
                        </div>
                        <div className={style.guest_tags}>
                            <label>
                                Add Guest Tag
                            </label>
                            <input  onFocus={()=>setShowValidateTagsBubble(false)} onBlur={validateTags()} value={tags} placeholder={"enter tags seperated by a comma"} onChange={(e)=>{setTags(e.target.value)}} className={style.tag_input}/>
                            {selectedGuest?.tags && selectedGuest.tags.map((tag)=>{
                                    return(
                                        <div key={tag.id} className={style.tag}>
                                            <span className={style.tag_name}>{tag.name}</span>
                                            <DeleteTag onClick={()=>handleRemoveTag(tag.id)}className={style.delete_tag}/>
                                        </div>
                                    )
                                })
                            }
                            {showValidateTagsBubble && <AlertBubble message={showValidateTagsBubble}/>}
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
                                <input onBlur={validatePhone} onFocus={()=>setShowValidatePhoneBubble(false)} value={phoneNumber} onChange={(e) => {setPhoneNumber(e.target.value)}} className={style.phone_input}></input>
                            </>}
                            {!selectedGuest && <input onBlur={validatePhone} onFocus={()=>setShowValidatePhoneBubble(false)} onChange={(e) => {setPhoneNumber(e.target.value)}} value={phoneNumber} className={style.phone_input}></input>}
                            {showValidatePhoneBubble && <AlertBubble message={showValidatePhoneBubble}/>}
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
                                <input onBlur={validateEmail} onFocus={()=>setShowValidateEmailBubble(false)} onChange={(e) => {setEmail(e.target.value)}} value={email} className={style.email_input}></input>
                            </>}
                            {!selectedGuest && <input onBlur={validateEmail} onFocus={()=>setShowValidateEmailBubble(false)} onChange={(e) => {setEmail(e.target.value)}} value={email} className={style.email_input}></input>}
                            {showValidateEmailBubble && <AlertBubble message={showValidateEmailBubble}/>}
                        </div>
                    </div>
                    <div className={style.tag_section}>
                        <div className={style.tag_section_title}>Visit Tags</div>
                        <div className={style.tags_block}>
                            <label>Add</label>
                            <input  value={newVisitTags} placeholder={"enter tags seperated by a comma"} onChange={(e)=>{setNewVisitTags(e.target.value)}} className={style.tag_input}></input>
                            {visitTags &&
                            <>
                                {visitTags.map((tag)=>{
                                    return(
                                        <div key={tag.id} className={style.tag}>
                                            <span className={style.tag_name}>{tag.name}</span>
                                            <DeleteTag onClick={()=>handleRemoveVisitTag(tag.id)}className={style.delete_tag}/>
                                        </div>
                                    )
                                })}
                            </>}
                            {editWaitlist && editWaitlist.tags &&
                            <>
                                {editWaitlist.tags.map((tag)=>{
                                    return(
                                        <div key={tag.id} className={style.tag}>
                                            <span className={style.tag_name}>{tag.name}</span>
                                            <DeleteTag onClick={()=>handleRemovePartyTag(editWaitlist.id, tag.id)}className={style.delete_tag}/>
                                        </div>
                                    )
                                })}
                            </>}
                        </div>
                    </div>
                </form>}
                {(submitStatus === 'update res' || submitStatus === 'update party') &&
                    <div  onClick={handleSubmitRouter} className={style.place_reservation_button}>{bookRes !== 'new' ? 'Update Reservation' : 'Update Waitlist'}</div>
                }
                {(submitStatus === 'submit res' || submitStatus === 'submit party') &&
                    <div onClick={handleSubmitRouter} className={style.place_reservation_button}>{showAddWaitlist ? 'Add to Waitlist' : 'Reserve Table'}</div>
                }
                {submitStatus === 'add guest' &&
                    <div className={style.disabled_reservation_button}>{'Please add a guest'}</div>
                }
            </div>
        </div>
    )
}
// book res
// update res

// if !selectedGuest || validation errors || !selectedGuest && (!name || !phoneNumber)
// add guest *grey*

// if waitlist options are truthy
// book party
// if editWaitlist is truthy
// update party


export default AddGuest;
