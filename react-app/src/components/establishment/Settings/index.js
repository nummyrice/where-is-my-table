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
import SubmitTable from './SubmitTable'
import DisplayTables from './DisplayTables';

const Settings = ({settingTab, setSettingTab}) => {

    const dispatch = useDispatch()

    const establishment = useSelector(state => state.establishment)
    const errors = useSelector(state => state.errors)
    const [newSectionForm, setNewSectionForm] = useState(false)
    const [editSections, setEditSections] = useState([])
    const [showErrorsModal, setShowErrorsModal] = useState(false)
    const [newTable, setNewTable] = useState(null)
    const [editTables, setEditTables] = useState([])


    const errorClose = () => {
        setShowErrorsModal(false)
        dispatch(clearErrors())
    }
    if (settingTab === 'tables') {
        return(
            <div id={style.sections_page}>
                {newTable && <SubmitTable sections={establishment.sections} newTable={newTable} setNewTable={setNewTable} editTable={null} setEditTable={null}/>}
                {!newTable && <>
                    <button onClick={() => setNewTable(true)} id={style.new_section_button}>{"New Table"}</button>
                    <div id={style.divider}></div>
                </>}
                {Object.keys(establishment.sections).map(sectionId => {
                    const section = establishment.sections[sectionId]
                    return(
                        <React.Fragment key={`section_${section.id}`}>
                            {section.tables && Object.keys(section.tables).map(tableId => {
                                const table = section.tables[tableId]
                                return(
                                    <React.Fragment key={`display_or_edit_${table.id}`}>
                                        {!editTables.find(editTable => editTable.id === table.id) && <DisplayTables table={table} setEditTables={setEditTables} editTables={editTables}/>}
                                        {editTables.find(editTable => editTable.id === table.id) && <SubmitTable id={table.id} sections={establishment.sections} editTables={editTables} newTable={null} setEditTables={setEditTables} setNewTable={null}/>}
                                    </React.Fragment>
                                )
                            })}
                        </React.Fragment>
                    )
                })}
            </div>
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
                {newSectionForm &&
                    <>
                        <NewSection setNewSectionForm={setNewSectionForm} setShowErrorsModal={setShowErrorsModal}/>
                        <div id={style.divider}></div>
                    </>
                    }
                {!newSectionForm &&
                    <>
                        <button onClick={() => setNewSectionForm(true)} id={style.new_section_button}>{"New Section"}</button>
                        <div id={style.divider}></div>
                    </>
                }
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
