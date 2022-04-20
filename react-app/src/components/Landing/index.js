import React from 'react';
import style from './Landing.module.css';
import bread from './assets/bread.png';
import chili from './assets/chili.png';
import pie from './assets/pie.png';
import { ReactComponent as Food1} from './assets/food1.svg';
import { ReactComponent as Food2 } from './assets/food2.svg';
import guest_pic from './assets/guest_pic.png';
import establishment_pic from './assets/establishment_pic.png';
import githubLogo from './assets/github.png';
import linkedinLogo from './assets/linkedin.png';


const Landing = () => {

    return(
        <div className={style.landing_main}>
            <div id={style.intro_section}>
                <img alt='bread' src={bread}id={style.bread_icon} className={style.icon}></img>
                <img alt='chili' src={chili}id={style.chili_icon} className={style.icon}></img>
                <img alt='pie' src={pie}id={style.pie_icon} className={style.icon}></img>
                <Food1 id={style.food1_icon} className={style.icon}/>
                <Food2 id={style.food2_icon} className={style.icon}/>
                <p id={style.intro} className={style.txt}>Let tableGater manage your table reservations. Keep the phone lines open and save time by allowing customers to join the waitlist or book a table right from your website.</p>
                <div id={style.links_section}>
                    <a href={"https://github.com/nummyrice"} id={style.github}>
                        <img alt='github logo' src={githubLogo}></img>
                        <div>nummyRice</div>
                    </a>
                    <a href={"http://www.linkedin.com/in/nicholas-rice-7b7aba93"} id={style.linkedIn}>
                    <img alt='linkedin logo' src={linkedinLogo}></img>
                        <div>Nicholas Rice</div>
                    </a>
                </div>
            </div>
            <div id={style.feature_section}>
                <p className={style.txt} id={style.features_description}>With this demo app you can either explore availablity as a guest looking to reserve a table or gain establishment access and use tableGater's robust reservation system as a restaurant employee.</p>
                <img src={guest_pic} alt='guest' id={style.example_image_1}></img>
                <p className={style.txt} id={style.guest_example}>Create an account, login or use our demo guest. Then you can browse our table availability</p>
                <img src={establishment_pic} alt='establishment' id={style.example_image_2}></img>
                <p className={style.txt} id={style.esatablishment_example}>...or login as our demo establishment as an employee and manage/view reservations.</p>
            </div>
        </div>
    )
}

export default Landing;
