import React from 'react'
import { useDispatch } from 'react-redux'
import style from './Settings.module.css'
import { deleteTable } from '../../../store/establishment'

const DisplayTables = ({table, setEditTables, editTables}) => {
    const dispatch = useDispatch()

    return(
        <React.Fragment>
            <h2 className={style.display_section_name}>{table.name}</h2>
            <div>
                <div>{table.section.name}</div>
                <div>{`${table.min_seat} to ${table.max_seat} guests`}</div>
                <div>{`customers see ${table.customer_view_name}`}</div>
            </div>
            <button onClick={()=>setEditTables([...editTables, table])} className={style.edit_section_button}>{"Edit Table"}</button>
            <button onClick={()=>dispatch(deleteTable(table.id))} className={style.delete_section_button}>{"Delete"}</button>
        </React.Fragment>
    )
}

export default DisplayTables
