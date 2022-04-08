import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from './Settings.module.css'
import DisplaySection from './DisplaySection';
import EditSection from './EditSection';
import DisplayErrors from '../DisplayErrors';
import { Modal } from '../../../context/Modal';
import { clearErrors, setErrors } from '../../../store/errors';
import { newSection } from '../../../store/establishment';
import NewSection from './NewSection'
import EditEstablishment from './EditEstablishment';

const Settings = ({settingTab, setSettingTab}) => {

    const dispatch = useDispatch()

    const establishment = useSelector(state => state.establishment)
    const errors = useSelector(state => state.errors)
    const [newSectionForm, setNewSectionForm] = useState(false)
    const [editSections, setEditSections] = useState([])
    const [showErrorsModal, setShowErrorsModal] = useState(false)


    const errorClose = () => {
        setShowErrorsModal(false)
        dispatch(clearErrors())
    }
    if (settingTab === 'tables') {
        return(
            <div id={style.sections_page}></div>
        )
    }
    if (settingTab === "establishment") {
        return(
            <div id={style.sections_page}>
                <EditEstablishment establishment={establishment} setShowErrorsModal={setShowErrorsModal}/>
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
    if (settingTab === "sections") {
        return(
            <div id={style.sections_page}>
                {newSectionForm && <NewSection setNewSectionForm={setNewSectionForm} setShowErrorsModal={setShowErrorsModal}/>}
                {!newSectionForm && <button onClick={() => setNewSectionForm(true)} id={style.new_section_button}>{"New Section"}</button>}
                {establishment.sections && Object.keys(establishment.sections).map(sectionId => {
                    const section = establishment.sections[sectionId]
                    return(
                        <React.Fragment key={sectionId}>
                            {!editSections.find(id => id === section.id) && <DisplaySection section={section} editSections={editSections} setEditSections={setEditSections}/>}
                            {editSections.find(id => id === section.id) && <EditSection section={section} editSections={editSections} setEditSections={setEditSections} setShowErrorsModal={setShowErrorsModal}/>}
                        </React.Fragment>
                    )
                })}
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
}



export default Settings;
