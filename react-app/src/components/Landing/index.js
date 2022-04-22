import React from 'react';
import { Carousel } from "react-bootstrap";
import ReactPlayer from "react-player";
import "bootstrap/dist/css/bootstrap.css";
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
import Selfie from './assets/nick_selfie.png'
import "./VideoCarousel.css";



const Landing = () => {

  const videoProperties = [
    {
      id: 1,
      title: "Video 1",
      src:"https://www.youtube.com/watch?v=lRer6SbMCHw",
      credit: "Video by cottonbro from Pexels",
    },
    {
      id: 2,
      title: "Video 2",
      src: "https://www.youtube.com/watch?v=lRer6SbMCHw",
      credit: "Video by cottonbro from Pexels",
    },
    {
      id: 3,
      title: "Video 3",
      src:"https://www.youtube.com/watch?v=lRer6SbMCHw",
      credit: "Video by cottonbro from Pexels",
    },
  ];

    return(
        <div className={style.landing_main}>
          <h1>{"table management made easy"}</h1>
          <div className={style.gradient_border}>
    <Carousel>
        {videoProperties.map((videoObj) => {
          return (
            <Carousel.Item key={videoObj.id}>
              <ReactPlayer
                url={videoObj.src}
                pip={true}
                controls={true}
                playing={true}
              />
              <Carousel.Caption>
                <h3>{videoObj.title}</h3>
                <p>{videoObj.credit}</p>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
      </Carousel>
      </div>
          <div className={style.container}>
          <div className={style.bordered}>
                <div id={style.links_section}>
                  <a className={style.selfie}href={"https://nummyrice.github.io/"}>
                    <img alt='linkedin logo' src={Selfie}></img>
                    <div>Me</div>
                  </a>
                    <a href={"https://github.com/nummyrice"} id={style.github}>
                        <img className={style.more_links} alt='github logo' src={githubLogo}></img>
                        <div>nummyRice</div>
                    </a>
                    <a href={"http://www.linkedin.com/in/nicholas-rice-7b7aba93"} id={style.linkedIn}>
                    <img className={style.more_links} alt='linkedin logo' src={linkedinLogo}></img>
                        <div>Nicholas Rice</div>
                    </a>
                </div>
            </div>
            </div>
            {/* <div id={style.intro_section}>
                <img alt='bread' src={bread}id={style.bread_icon} className={style.icon}></img>
                <img alt='chili' src={chili}id={style.chili_icon} className={style.icon}></img>
                <img alt='pie' src={pie}id={style.pie_icon} className={style.icon}></img>
                <Food1 id={style.food1_icon} className={style.icon}/>
                <Food2 id={style.food2_icon} className={style.icon}/>
                <p id={style.intro} className={style.txt}>Let tableGater manage your table reservations. Keep the phone lines open and save time by allowing customers to join the waitlist or book a table right from your website.</p>
            </div> */}

        </div>
    )
}

export default Landing;
