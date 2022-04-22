
import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Redirect, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';
import style from './NavBar.module.css';
import logo from './assets/Artboard1.png';
import { ReactComponent as Dragon} from './assets/dragon-solid.svg';
import { ReactComponent as Bird} from './assets/crow-solid.svg';
import { ReactComponent as DropDownIcon } from './assets/bars-solid.svg';
// import { login, deleteUser } from '../../store/session';
import { getEstablishment } from '../../store/establishment';
import { ReactComponent as AlligatorHead } from './assets/alligator-head.svg';
import { ReactComponent as OpenMouth } from './assets/open-mouth.svg'

const NavBar = () => {
  const user = useSelector(state => state.session?.user)
  const establishment = useSelector(state => state.establishment)
  console.log("establishment ", establishment)

  // ---------Responsive-navbar-active-animation-----------
  function test(){
  // var tabsNewAnim = document.getElementById(`${style.navbarSupportedContent}`)
  var activeItemNewAnim = document.getElementsByClassName(`${style.active}`);
    if (activeItemNewAnim.length) {
  var computed = getComputedStyle(activeItemNewAnim[0]),
    paddingHeight = parseInt(computed.paddingTop, 10) + parseInt(computed.paddingBottom, 10),
    paddingWidth = parseInt(computed.paddingRight, 10) + parseInt(computed.paddingLeft, 10),
    marginHeight = parseInt(computed.marginTop, 10) + parseInt(computed.marginBottom, 10),
    marginWidth = parseInt(computed.marginLeft, 10) + parseInt(computed.marginRight, 10)
  var activeWidthNewAnimHeight = activeItemNewAnim.clientHeight - paddingHeight
  var activeWidthNewAnimWidth = activeItemNewAnim.clientWidth - paddingWidth
  var itemPosNewAnimTop = activeItemNewAnim.offsetTop - marginHeight
  var itemPosNewAnimLeft = activeItemNewAnim.offsetLeft - marginWidth
  var horiSelector = document.getElementsByClassName(`${style.hori_selector}`)[0]
  horiSelector.style.top = itemPosNewAnimTop + "px"
  horiSelector.style.left = itemPosNewAnimLeft+ "px"
  horiSelector.style.height = activeWidthNewAnimHeight + "px"
  horiSelector.style.width = activeWidthNewAnimWidth + "px"
  var navBarSupportedContent = document.getElementById(`${style.navbarSupportedContent}`)
  var navBarSupportedContentUL = document.getElementsByClassName(`${style.navbar_nav}`)[0]
  navBarSupportedContent.addEventListener('click', (event) => {
    for (let i = 0; i < navBarSupportedContentUL.children.length; i++) {
      navBarSupportedContentUL.children[i].classList.remove(`${style.active}`)
    }
    var targetElement = event.target.parentElement
    if (targetElement) {
      targetElement.classList.add(`${style.active}`);

    var computed = getComputedStyle(targetElement),
    paddingHeight = parseInt(computed.paddingTop, 10) + parseInt(computed.paddingBottom, 10),
    paddingWidth = parseInt(computed.paddingRight, 10) + parseInt(computed.paddingLeft, 10)
    var activeWidthNewAnimHeight = targetElement.clientHeight - paddingHeight
    var activeWidthNewAnimWidth = targetElement.clientWidth - paddingWidth
    var itemPosNewAnimTop = targetElement.offsetTop
    var itemPosNewAnimLeft = targetElement.offsetLeft
    var horiSelector = document.getElementsByClassName(`${style.hori_selector}`)[0]
    horiSelector.style.top = itemPosNewAnimTop + "px"
    horiSelector.style.left = itemPosNewAnimLeft+ "px"
    horiSelector.style.height = activeWidthNewAnimHeight + "px"
    horiSelector.style.width = activeWidthNewAnimWidth + "px"
  }})}
	// var tabsNewAnim = $('#navbarSupportedContent');
	// var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
	// var activeItemNewAnim = tabsNewAnim.find('.active');
	// var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
 	// var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth(); //
	// var itemPosNewAnimTop = activeItemNewAnim.position();
	// var itemPosNewAnimLeft = activeItemNewAnim.position();
	// $(".hori-selector").css({
	// 	"top":itemPosNewAnimTop + "px",
	// 	"left":itemPosNewAnimLeft + "px",
	// 	"height": activeWidthNewAnimHeight + "px",
	// 	"width": activeWidthNewAnimWidth + "px"
	// });
	// $("#navbarSupportedContent").on("click","li",function(e){
	// 	$('#navbarSupportedContent ul li').removeClass("active");
	// 	$(this).addClass('active');
	// 	var activeWidthNewAnimHeight = $(this).innerHeight();
	// 	var activeWidthNewAnimWidth = $(this).innerWidth();
	// 	var itemPosNewAnimTop = $(this).position();
	// 	var itemPosNewAnimLeft = $(this).position();
	// 	$(".hori-selector").css({
	// 		"top":itemPosNewAnimTop.top + "px",
	// 		"left":itemPosNewAnimLeft.left + "px",
	// 		"height": activeWidthNewAnimHeight + "px",
	// 		"width": activeWidthNewAnimWidth + "px"
	// 	});
	// });
}
useEffect(()=>{
	setTimeout(function(){ test(); });
  var path = window.location.pathname.split("/").pop();

	// Account for home page with empty path
	if ( path === '' ) {
		path = 'index.html';
	}

 var navItems = document.getElementsByClassName(`${style.nav_item}`)

 var target;
 for (let i = 0; i < navItems.length; i++) {
   console.log("navItems: ", navItems[i].children[0].href)
   console.log("path: ", path)
  if (navItems[i].children[0].href.split("/").pop() === path) {
    target = navItems[i]
    break;
  }
 }
	// Add active class to target link
  if (target) target.classList.add(`${style.active}`);
}, [])
window.addEventListener('resize', function(){
	setTimeout(function(){ test(); }, 500);
});
// document.getElementsByClassName(`${style.navbar_toggler}`).add(function(){
// 	$(".navbar-collapse").slideToggle(300);
// 	setTimeout(function(){ test(); });
// });



// // --------------add active class-on another-page move----------

function collapseExpand(event) {
  var collapseNavbar = document.getElementsByClassName(`${style.navbar_collapse}`)[0]
  if (collapseNavbar) {
    if (collapseNavbar.style.display === 'block') {
      // collapseNavbar.style.height = '0'
      collapseNavbar.style.display = 'none'
    } else {
      // collapseNavbar.height = collapseNavbar.style.scrollHeight
      collapseNavbar.style.display = 'block'
    }
  }
}


  // if (user?.id === 1) return <Redirect to='/establishment'/>
  return (
    <nav className={`${style.navbar} ${style.navbar_expand_custom} ${style.navbar_mainbg}`}>
        <Link  style={{textDecoration: "none", color: "inherit"}}  className={style.home_navlink} to='/' exact="true">
          <AlligatorHead id={style.tableGater_icon}/>
          <GaterSpeechBubble/>
        </Link>
      <button onClick={collapseExpand} className={style.navbar_toggler}
      type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <DropDownIcon/>
        </button>
        <div className={`${style.collapse} ${style.navbar_collapse}`} id={`${style.navbarSupportedContent}`}>
            <ul className={`${style.navbar_nav} ${style.ml_auto}`}>
                <div className={style.hori_selector}><div className={style.left}></div><div className={style.right}></div></div>
                <li className={style.nav_item}>
                    <Link className={style.nav_link} to="/" ><i className="far fa-chart-bar"></i>Home</Link>
                </li>
                <li className={`${style.nav_item} ${style.active}`}>
                    <Link className={style.nav_link} to={'/reserve-a-table/village_baker/1'}><i className="far fa-address-book"></i>Demo Reservations</Link>
                </li>
                <li className={style.nav_item}>
                    <Link className={style.nav_link} to={"/join-waitlist/village_baker/1"} ><i className="far fa-clone"></i>Demo Waitlist</Link>
                </li>
                <li className={style.nav_item}>
                    <Link className={style.nav_link} to={"/demo-dashboard-access"} ><i className="far fa-clone"></i>Demo Dashboard</Link>
                </li>
                {!user && <li className={style.nav_item}>
                    <Link className={style.nav_link} to="sign-up"><i className="far fa-calendar-alt"></i>Sign Up</Link>
                </li>}
                {!user && <li className={style.nav_item}>
                    <Link className={style.nav_link} to="/login"><i className="fas fa-tachometer-alt"></i>Login</Link>
                </li>}
                {user && !establishment && <li className={style.nav_item}>
                    <Link className={style.nav_link} to='/establishment-setup'><i className="far fa-copy"></i>Set Up a Restaurant</Link>
                </li>}
                {user && <li className={style.nav_item}>
                    <Link className={style.nav_link} to='/logout-page'><i className="far fa-copy"></i>Logout</Link>
                </li>}
            </ul>
        </div>
      {/* {user && <div id={style.welcome}>{`Welcome ${user.name.toUpperCase()}`}</div>}
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
        {user && !user.establishment && <li>
          <NavLink style={{textDecoration: "none"}} to='/establishment-setup' exact={true} activeClassName='active'>
            Restaurant Setup
          </NavLink>
        </li>}
        {user && <li>
          <NavLink style={{textDecoration: "none"}} to='/users' exact={true} activeClassName='active'>
            Users
          </NavLink>
        </li>}
        {establishment && <li>
          <NavLink style={{textDecoration: "none"}} to='/establishment' exact={true} activeClassName='active'>
            Restaurant Dashboard
          </NavLink>
        </li>}
        {user && (user.id !== 1 && user.id !== 4) && <li id={style.delete_user} onClick={()=> {dispatch(deleteUser(user.id))}}>
          Delete My Account
        </li>}
        {user && <li>
          <LogoutButton/>
        </li>}
      </ul> */}
    </nav>
  );
}

export default NavBar;


function GaterSpeechBubble() {
  return(
    <div id={style.speech_container}>
      <div id={style.speech_bubble}>
        {"Welcome to TableGater"}
      </div>
    </div>
  )
}
