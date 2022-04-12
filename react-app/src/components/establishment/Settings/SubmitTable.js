import React, { useState} from 'react'
import style from './Settings.module.css'
import { useDispatch } from 'react-redux'
import { createTable, modifyTable } from '../../../store/establishment'

const minSeatRange = Array(20).fill(0).map((_, i) => i+1)
const maxSeatRange = Array(20).fill(0).map((_, i) => i+1)

const SubmitTable = ({id, sections, editTables, newTable, setEditTables, setNewTable}) => {
    const dispatch = useDispatch()
    let isEdit = false;
    if (id) {
        isEdit = editTables.find(table => table.id === id)
    }
    const [tableName, setTableName] = useState(isEdit ? isEdit.table_name : '')
    const [sectionId, setSectionId] = useState(isEdit ? isEdit.section_id : '')
    const [minSeat, setMinSeat] = useState(isEdit ? isEdit.min_seat : 1)
    const [maxSeat, setMaxSeat] = useState(isEdit ? isEdit.max_seat : 1)
    const [customerViewName, setCustomerViewName] = useState(isEdit ? isEdit.customer_view_name : '')

    const handleNewTableSubmit = (event) => {
        event.preventDefault()
        dispatch(createTable({table_name: tableName, section_id: sectionId, min_seat: minSeat, max_seat: maxSeat, customer_view_name: customerViewName}))
            .then(data =>{
                if (data.errors) {
                    console.log(data.errors)
                }
            })
    }

    const handleEditTable = (event) => {
        event.preventDefault()
        dispatch(modifyTable({id: editTables.id, name: tableName, section_id: sectionId, min_seat: minSeat, max_seat: maxSeat, customer_view_name: customerViewName}))
            .then(data =>{
                if (data.errors) {
                }
            })
    }

    const handleCancel = (event) => {
        event.preventDefault()
        if (id) {
            const newEditTables = editTables.filter(table => table.id !== id)
            setEditTables(newEditTables)
        }
        if (setNewTable) {
            setNewTable(null)
        }
    }
    return(
        <form id={style.new_section_form}>
            {newTable && <h3>{"New Table"}</h3>}
            {id && <h3>{"Edit Table"}</h3>}
            <label id={style.new_section_name_label} htmlFor={"table_name"}>{"Table Name"}</label>
            <input onChange={e => setTableName(e.target.value)} type={"text"} name={"table_name"} placeholder={"less than 40 characters"} value={tableName}></input>
            <label htmlFor={"section"}>{"Section"}</label>
            <select value={sectionId} name={"section"} onChange={(e)=>setSectionId(e.target.value)}>
                {Object.keys(sections).map((sectionId) => {
                    const section = sections[sectionId]
                    return(
                        <option key={section.id} value={section.id}>{section.name}</option>
                    )
                })}
            </select>
            <div>
                <h4>{"Capacity"}</h4>
                <label htmlFor={"minSeat"}>{"Minimum"}</label>
                <select value={minSeat} name={"minSeat"} onChange={(e)=>setMinSeat(e.target.value)}>
                    {minSeatRange.map((capacity) => {
                        return(
                            <option key={`minCapacity_${capacity}`} value={capacity}>{capacity}</option>
                        )
                    })}
                </select>
                <label htmlFor={"maxSeat"}>{"Maximum"}</label>
                <select value={maxSeat} name={"maxSeat"} onChange={(e)=>setMaxSeat(e.target.value)}>
                    {maxSeatRange.map((capacity) => {
                        return(
                            <option key={`maxCapacity_${capacity}`} value={capacity}>{capacity}</option>
                        )
                    })}
                </select>
            </div>
            <label id={style.new_section_name_label} htmlFor={"customer_view_name"}>{"Customer View Name"}</label>
            <input onChange={e => setCustomerViewName(e.target.value)} type={"text"} name={"customer_view_name"} placeholder={"less than 40 characters"} value={customerViewName}></input>
            <div id={style.new_section_button_block}>
                <button onClick={(event)=>handleCancel(event)}id={style.table_cancel_button}>{"Cancel"}</button>
                {editTables && <button onClick={(event) => handleEditTable(event)} id={style.update_table_submit_button}>{"Update Table"}</button>}
                {newTable && <button onClick={(event) => handleNewTableSubmit(event)} id={style.new_table_submit_button}>{"Submit Table"}</button>}
            </div>
        </form>
    )
}

export default SubmitTable;
