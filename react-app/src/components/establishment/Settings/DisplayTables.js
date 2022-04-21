import React from 'react'
import { useDispatch } from 'react-redux'
import style from './Settings.module.css'
import { deleteTable } from '../../../store/establishment'

const DisplayTables = ({table, setEditTables, editTables}) => {
    const dispatch = useDispatch()

    return(
        <React.Fragment key={`display_${table.id}`}>
            <h2 className={style.display_table_name}>{table.table_name}</h2>
            <div className={style.display_table}>
                <div>{table.section.name}</div>
                <div>{`${table.min_seat} to ${table.max_seat} guests`}</div>
                <div>{`customers see ${table.customer_view_name}`}</div>
                <button onClick={()=>setEditTables([...editTables, table])} className={style.edit_table_button}>{"Edit Table"}</button>
                <button onClick={()=>dispatch(deleteTable(table.id, table.section.id))} className={style.delete_table_button}>{"Delete"}</button>
            </div>
        </React.Fragment>
    )
}

export default DisplayTables
