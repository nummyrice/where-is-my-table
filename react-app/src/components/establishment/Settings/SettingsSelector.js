import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'
import LogoutButton from '../../auth/LogoutButton';
import style from './Settings.module.css';

const SettingsSelector = () => {

    return (
        <div id={style.settings_panel}>
            <div>{"Settings"}</div>
            <LogoutButton/>
            <NavLink to={"/establishment/settings"}>{"Sections"}</NavLink>
        </div>
    )
}

export default SettingsSelector;
