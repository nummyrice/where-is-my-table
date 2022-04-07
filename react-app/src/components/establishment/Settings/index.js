import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'
import LogoutButton from '../../auth/LogoutButton';
import style from './Settings.module.css';

const Settings = () => {

    return (
        <div id={style.settings_panel}>
            <div>{"Settings"}</div>
            <LogoutButton/>
            <NavLink to={"/establishment/sections"}>{"Sections"}</NavLink>
        </div>
    )
}

export default Settings;
