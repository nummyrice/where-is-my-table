import React from 'react';
import { useSelector } from 'react-redux';
import style from './Settings.module.css'

const SettingsNav = ({settingTab, setSettingTab}) => {
    const establishment = useSelector(state => state.establishment)

    return(
        <div id={style.settings_nav}>
            <h1>{`Manage ${establishment.name} Settings`}</h1>
            <div id={style.return_button}></div>
            <button onClick={() => setSettingTab("establishment")}>{"Restaurant"}</button>
            <button onClick={() => setSettingTab("tables")}>{"Sections"}</button>
            <button onClick={() => setSettingTab("tables")}>{"Tables"}</button>
        </div>
    )
}

export default SettingsNav;
