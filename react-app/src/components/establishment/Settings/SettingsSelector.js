import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'
import LogoutButton from '../../auth/LogoutButton';
import style from './Settings.module.css';

const SettingsSelector = () => {

    return (
        <div id={style.settings_panel}>
            <NavLink is style={{fontSize: "20px", marginBottom: "20px", color: "grey", textDecoration: "none", fontWeight: "20px"}} to={"/establishment/settings"}>{"Settings"}</NavLink>
            <LogoutButton/>
        </div>
    )
}

export default SettingsSelector;
