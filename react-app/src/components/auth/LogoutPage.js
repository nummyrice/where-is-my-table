import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { logout } from '../../store/session'
import { ReactComponent as Alligator } from '../NavBar/assets/alligator-head.svg'
import style from './auth.module.css'
const LogoutPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(() => {
        setTimeout(async (e) => {
            await dispatch(logout());
            history.push("/")
          }, 3000)
    }, [])
    return(
        <>
            <Alligator id={style.alligator_icon}/>
            <div id={style.later}>later</div>
            <div id={style.gater}>gater</div>
        </>
    )
}
export default LogoutPage
