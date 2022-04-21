import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import style from './Settings.module.css';
import { ReactComponent as EditIcon } from '../LeftPanel/assets/chevron-right-solid.svg';

const SettingsNav = ({settingTab, setSettingTab}) => {
    const history = useHistory()
    const establishment = useSelector(state => state.establishment)

    return(
        <div id={style.settings_nav}>
            <div onClick={()=> history.push('/establishment')} id={style.return_button}><EditIcon/></div>
            <h1>{`Manage ${establishment.name} Settings`}</h1>
            <div id={style.establishment_selector} className={`${style.setting_tab} ${settingTab === 'establishment' ? style.selected_tab : null}`} onClick={() => setSettingTab("establishment")}>{"Restaurant"}</div>
            <div id={style.sections_selector} className={`${style.setting_tab} ${settingTab === 'sections' ? style.selected_tab : null}`} onClick={() => setSettingTab("sections")}>{"Sections"}</div>
            <div id={style.tables_selector} className={`${style.setting_tab} ${settingTab === 'tables' ? style.selected_tab : null}`} onClick={() => setSettingTab("tables")}>{"Tables"}</div>
        </div>
    )
}

export default SettingsNav;
