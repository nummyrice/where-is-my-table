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

  document.addEventListener("click", e => {
    let handle
    if (e.target.matches(".handle")) {
      handle = e.target
    } else {
      handle = e.target.closest(".handle")
    }
    if (handle != null) onHandleClick(handle)
  })

  const throttleProgressBar = throttle(() => {
    document.querySelectorAll(".progress-bar").forEach(calculateProgressBar)
  }, 250)
  window.addEventListener("resize", throttleProgressBar)

  document.querySelectorAll(".progress-bar").forEach(calculateProgressBar)

  function calculateProgressBar(progressBar) {
    progressBar.innerHTML = ""
    const slider = progressBar.closest(".row").querySelector(".slider")
    const itemCount = slider.children.length
    const itemsPerScreen = parseInt(
      getComputedStyle(slider).getPropertyValue("--items-per-screen")
    )
    let sliderIndex = parseInt(
      getComputedStyle(slider).getPropertyValue("--slider-index")
    )
    const progressBarItemCount = Math.ceil(itemCount / itemsPerScreen)

    if (sliderIndex >= progressBarItemCount) {
      slider.style.setProperty("--slider-index", progressBarItemCount - 1)
      sliderIndex = progressBarItemCount - 1
    }

    for (let i = 0; i < progressBarItemCount; i++) {
      const barItem = document.createElement("div")
      barItem.classList.add("progress-item")
      if (i === sliderIndex) {
        barItem.classList.add("active")
      }
      progressBar.append(barItem)
    }
  }

  function onHandleClick(handle) {
    const progressBar = handle.closest(".row").querySelector(".progress-bar")
    const slider = handle.closest(".container").querySelector(".slider")
    const sliderIndex = parseInt(
      getComputedStyle(slider).getPropertyValue("--slider-index")
    )
    const progressBarItemCount = progressBar.children.length
    if (handle.classList.contains("left-handle")) {
      if (sliderIndex - 1 < 0) {
        slider.style.setProperty("--slider-index", progressBarItemCount - 1)
        progressBar.children[sliderIndex].classList.remove("active")
        progressBar.children[progressBarItemCount - 1].classList.add("active")
      } else {
        slider.style.setProperty("--slider-index", sliderIndex - 1)
        progressBar.children[sliderIndex].classList.remove("active")
        progressBar.children[sliderIndex - 1].classList.add("active")
      }
    }

    if (handle.classList.contains("right-handle")) {
      if (sliderIndex + 1 >= progressBarItemCount) {
        slider.style.setProperty("--slider-index", 0)
        progressBar.children[sliderIndex].classList.remove("active")
        progressBar.children[0].classList.add("active")
      } else {
        slider.style.setProperty("--slider-index", sliderIndex + 1)
        progressBar.children[sliderIndex].classList.remove("active")
        progressBar.children[sliderIndex + 1].classList.add("active")
      }
    }
  }

  function throttle(cb, delay = 1000) {
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
      if (waitingArgs == null) {
        shouldWait = false
      } else {
        cb(...waitingArgs)
        waitingArgs = null
        setTimeout(timeoutFunc, delay)
      }
    }

    return (...args) => {
      if (shouldWait) {
        waitingArgs = args
        return
      }

      cb(...args)
      shouldWait = true
      setTimeout(timeoutFunc, delay)
    }
  }

    return(
        <div className={style.landing_main}>
            <div className={style.row}>
    <div className={style.header}>
      <h3 className={style.title}>Title</h3>
      <div className={style.progress_bar}></div>
    </div>
    <div className={style.container}>
      <button className={`${style.handle} ${style.left_handle}`}>
        <div className={style.text}>&#8249;</div>
      </button>
      <div className={style.slider}>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/210/00FF00?text=1"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/220/00FF00?text=2"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/230/00FF00?text=3"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/240/00FF00?text=4"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/250/00FF00?text=5"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/260/00FF00?text=6"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/270/00FF00?text=7"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/280/00FF00?text=8"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/250/00FF00?text=9"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/260/00FF00?text=10"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/270/00FF00?text=11"/>
        <img alt={style.video_placeholder} src="https://via.placeholder.com/280/00FF00?text=12"/>
      </div>
      <button className={`${style.handle} ${style.right_handle}`}>
        <div className={style.text}>&#8250;</div>
      </button>
    </div>
  </div>
            {/* <div id={style.intro_section}>
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
            </div> */}

        </div>
    )
}

export default Landing;
