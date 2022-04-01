import React, { useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import style from './AddWaitlist.module.css';
import {ReactComponent as X} from '../AddReservation/assets/times-solid.svg';
import AddGuest from '../AddGuest';
import { Modal } from '../../../context/Modal';
import DisplayErrors from '../DisplayErrors';
import { setErrors, clearErrors } from '../../../store/errors';
import ConfirmWaitlistModal from '../AddGuest/ConfirmWaitlistModal';
import { newWaitlistParty, updateWaitlistParty } from '../../../store/selectedDateWaitlist';
import { removePartyTag } from '../../../store/selectedDateWaitlist';

// add state in left panel
// add title bar for edit displaying current waitlist info
// must handle passing these props to AddGuest: selectDateIndex={selectDateIndex} selectTimeIndex={selectTimeIndex}
const AddWaitlist = ({editWaitlist, setEditWaitlist, setShowAddWaitlist, showAddWaitlist}) => {
    const [partySize, setPartySize] = useState(editWaitlist ? editWaitlist.party_size : 1)
    const [estimatedWait, setEstimatedWait] = useState(editWaitlist ? editWaitlist.estimated_wait : 5)
    const partySizeModel = Array(21).fill(0).map((space, guestNum) => guestNum + 1);
    const estimatedWaitModel = Array(20).fill(5).map((minutes, multiplier) => minutes * multiplier);
    const [selectedGuest, setSelectedGuest] = useState(editWaitlist ? editWaitlist.guest_info : null)
    const [showErrorsModal, setShowErrorsModal] = useState(false)
    const [showConfirmParty, setShowConfirmParty] = useState(false)
    const [newVisitTags, setNewVisitTags] = useState('')
    const errors = useSelector(state => state.errors)
    const dispatch = useDispatch()

    // NEW PARTY
    const handleNewPartySubmit = async () => {
    // if guest is selected but none of the edits are present
        dispatch(newWaitlistParty(selectedGuest.id, partySize, estimatedWait, newVisitTags))
            .then((data) => {
                if (data.errors) {
                    setShowConfirmParty(false)
                    setShowErrorsModal(true)
                } else {
                    setShowConfirmParty(false)
                    setShowAddWaitlist(false)
                }
            })
    }

    // UPDATE PARTY
    const handlePartyUpdate = async () => {
    // if guest is selected but none of the edits are present
        dispatch(updateWaitlistParty(editWaitlist.id, selectedGuest.id, partySize, estimatedWait, newVisitTags))
            .then((data) => {
                if (data.errors) {
                    setShowConfirmParty(false)
                    setShowErrorsModal(true)
                } else {
                    setShowConfirmParty(false)
                    setEditWaitlist(null)
                }
            })
    }

    // REMOVE VISIT TAG
    const handleRemoveVisitTag = async (tagId) => {
        dispatch(removePartyTag(editWaitlist.id, tagId))
            .then(data => {
                if (data.errors) {
                    setShowErrorsModal(true)
                    console.log("visit tag handler errors: ", data.errors)
                } else {
                    console.log("visit tag handler response: ", data)
                    return data
                }
            })
    }

    const errorClose = () => {
        setShowErrorsModal(false)
        dispatch(clearErrors())
    }
    return (
        <div className={style.modal_background}>
            <div className={style.modal}>
                {!editWaitlist && <div className={style.title}>Add to Waitlist</div>}
                {editWaitlist && <div className={style.title}>{`Edit Party Details`}</div>}
                {editWaitlist && <X onClick={() => {setEditWaitlist('')}} className={style.icon}/>}
                {!editWaitlist && <X onClick={() => {setShowAddWaitlist(false)}} className={style.icon}/>}
                <div className={style.date}>
                    <div className={style.top_scroll_space}></div>
                        <div className={style.date_cell_select}>Today</div>
                <div className={style.bottom_scroll_space}></div>
                </div>
                <div className={style.party_size}>
                    <div className={style.top_scroll_space}></div>
                    {partySizeModel.map((guestNum, index) => {
                        return(
                            <div onClick={() => {
                                setPartySize(guestNum)
                            }} key={index} className={partySize === guestNum ? style.party_cell_select : style.party_cell}>
                            <div className={style.guest_num}>{`${guestNum} ${guestNum === 1 ? 'Guest' : 'Guests'}`}</div>
                       </div>
                        )
                    })}
                    <div className={style.bottom_scroll_space}></div>
                </div>
                <div className={style.time}>
                    <div className={style.top_scroll_space}></div>
                    {estimatedWaitModel.map((wait, index) => {
                        // const datetime = new Date(availableTime.datetime);
                        // const localTimeString = datetime.toLocaleTimeString('en-Us', { hour: 'numeric', minute: '2-digit' });
                            return (
                                <div onClick={() => {
                                    setEstimatedWait(wait)
                                    }} key={index}
                                    className={estimatedWait === wait ? style.time_cell_select : style.time_cell}>
                                    <div className={style.time_text}>{`${wait} minutes`}</div>
                                </div>
                            )

                        }
                    )}
                    <div className={style.bottom_scroll_space}></div>
                </div>
                <AddGuest
                    setSelectedGuest={setSelectedGuest}
                    selectedGuest={selectedGuest}
                    setShowConfirmParty={setShowConfirmParty}
                    errors={errors}
                    errorClose={errorClose}
                    showErrorsModal={showErrorsModal}
                    setShowErrorsModal={setShowErrorsModal}
                    showAddWaitlist={showAddWaitlist}
                    newVisitTags={newVisitTags}
                    setNewVisitTags={setNewVisitTags}
                    visitTags={editWaitlist && editWaitlist.tags ? editWaitlist.tags : null}
                    handleRemoveVisitTag={handleRemoveVisitTag}
                    editWaitlist={editWaitlist}
                />
            </div>
            {showConfirmParty && (
                <Modal onClose={errorClose}>
                    <ConfirmWaitlistModal
                        handleNewPartySubmit={handleNewPartySubmit}
                        handlePartyUpdate={handlePartyUpdate}
                        setShowConfirmParty={setShowConfirmParty}
                        partySize={partySize}
                        estimatedWait={estimatedWait}
                        selectedGuest={selectedGuest}
                        editWaitlist={editWaitlist}
                    />
                </Modal>
            )}
            {showErrorsModal && (
            <Modal onClose={errorClose}>
                <DisplayErrors
                    errors={errors}
                    errorClose={errorClose}
                />
            </Modal>
        )}
        </div>
    )
}

export default AddWaitlist
