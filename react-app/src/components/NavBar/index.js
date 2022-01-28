
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';
import style from './NavBar.module.css';
import logo from './assets/Artboard1.png';
import { ReactComponent as Dragon} from './assets/dragon-solid.svg';
import { ReactComponent as Bird} from './assets/crow-solid.svg';
import { ReactComponent as DropDownIcon } from './assets/bars-solid.svg';
import { login, deleteUser } from '../../store/session';

const NavBar = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session?.user)
  const demoGuestLogin = () => {
    dispatch(login('guest_demo@aa.io', 'password4'))
  };

  const demoEstablishmentLogin = () => {
    dispatch(login('establishment_demo@aa.io', 'password1'))
  };

  if (user?.id === 1) return <Redirect to='/establishment'/>
  return (
    <nav className={style.navbar_main}>
      <div>
        <NavLink className={style.home_navlink} to='/' exact={true} activeClassName='active'>
          <img alt='Logo' src={logo}></img>
        </NavLink>
      </div>
      {user && <div id={style.welcome}>{`Welcome ${user.name.toUpperCase()}`}</div>}
      {(!user || user?.id !== 4) && <div onClick={demoGuestLogin} id={style.demo_guest}>
        <Bird/>
        <div id={style.demo_guest_txt}>Demo Guest</div>
      </div>}
      {(!user || user?.id !== 1) && <div onClick={demoEstablishmentLogin} id={style.demo_establishment}>
        <Dragon/>
        <div id={style.demo_establishment_txt}>Demo Restaurant</div>
      </div>}
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
        {user && <li>
          <NavLink style={{textDecoration: "none"}} to='/users' exact={true} activeClassName='active'>
            Users
          </NavLink>
        </li>}
        {user && <li>
          <LogoutButton/>
        </li>}
        {user && (user.id !== 1 && user.id !== 4) && <li id={style.delete_user} onClick={()=> {dispatch(deleteUser(user.id))}}>
          Delete My Account
        </li>}
      </ul>
    </nav>
  );
}

export default NavBar;
