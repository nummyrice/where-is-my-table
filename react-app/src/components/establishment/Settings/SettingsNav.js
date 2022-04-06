import React from 'react';
import { useSelector } from 'react-redux';
import style from './Settings.module.css'

const SettingsNav = () => {
    const user = useSelector(state => state.session.user)

    return(
        <div id={style.settings_nav}>
            <h1>{`Manage ${user.establishment.name} Settings`}</h1>
            <div id={style.return_button}></div>
        </div>
    )
}

export default SettingsNav;
