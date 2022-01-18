import React, { useState } from 'react';
import LogoutButton from '../../auth/LogoutButton';
import style from './Settings.module.css';

const Settings = () => {

    return (
        <div id={style.settings_panel}>
            <div>Settings</div>
            <LogoutButton/>

        </div>
    )
}

export default Settings;
