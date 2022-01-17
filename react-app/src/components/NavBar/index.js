
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';
import style from './NavBar.module.css';
import logo from './assets/Artboard1.png';
import { ReactComponent as DropDownIcon } from './assets/bars-solid.svg';

const NavBar = () => {
  const user = useSelector(state => state.session?.user)
  return (
    <nav className={style.navbar_main}>
      <div>
        <NavLink className={style.home_navlink} to='/' exact={true} activeClassName='active'>
          <img alt='Logo' src={logo}></img>
        </NavLink>
      </div>
      <div id={style.drop_down}>
      <DropDownIcon className={style.dropdown_icon}/>
      </div>
      <ul className={style.ul_flex}>
        {!user && <li>
          <NavLink style={{textDecoration: "none"}} to='/login' exact={true} activeClassName='active'>
            Login
          </NavLink>
        </li>}
        {!user &&
        <li>
          <NavLink style={{textDecoration: "none"}} to='/sign-up' exact={true} activeClassName='active'>
            Sign Up
          </NavLink>
        </li>}
        <li>
          <NavLink style={{textDecoration: "none"}} to='/users' exact={true} activeClassName='active'>
            Users
          </NavLink>
        </li>
        {user && <li>
          <LogoutButton />
        </li>}
      </ul>
    </nav>
  );
}

export default NavBar;
