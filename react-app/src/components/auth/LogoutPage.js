import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { logout } from '../../store/session'
import { ReactComponent as Alligator } from './assets/smiley-gater.svg'
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
        <div id={style.logout_container}>
            <Alligator id={style.alligator_icon}/>
            <div className={style.fade_in} id={style.later}>later</div>
            <div className={style.fade_in2} id={style.gater}>gater</div>
        </div>
    )
}
export default LogoutPage
