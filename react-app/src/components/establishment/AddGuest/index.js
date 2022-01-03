import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import style from "./AddGuest.module.css";
import {ReactComponent as CheckCircle} from './assets/check-circle-solid.svg';
import {ReactComponent as Circle} from  './assets/circle-regular.svg';
import {ReactComponent as EditIcon} from './assets/edit-regular.svg';

const AddGuest = () => {
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
    const [name, setName] = useState();
    const [tags, setTags] = useState();
    const [notes, setNotes] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [email, setEmail] = useState();

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
                                <input className={style.tag_input}></input>
                            </>}
                            {!selectedGuest &&<input className={style.tag_input}></input>}
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
                            {!selectedGuest  && <input onChange={(e) => {setName(e.target.value)}} value={notes} className={style.notes_input}></input>}
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
                {selectedGuest  && <div  onClick={() => { console.log('clicked on reserve a table')}} className={style.place_reservation_button}>{'Reserve Table'}</div>}
                {!selectedGuest && <div className={style.disabled_reservation_button}>{'Please add a guest'}</div>}
            </div>
        </div>
    )
}

export default AddGuest;
