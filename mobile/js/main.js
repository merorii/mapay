(() => {
  let yOffset = 0; //window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞 에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true

  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId;
  let rafState;
  let setHeightOnce1 = false;
  let setHeightOnce3 = false;

  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 4, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImagesCount: 161,
        imageSequence: [0, 160],
        canvas_opacity_out: [1, 0, { start: 0.8, end: 1 }],
      },
    },
    {
      // 1
      type: "sticky",
      heightNum: 7,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
        topWrap: document.querySelector("#scroll-section-1 .top-wrap"),
        stickyWrap: document.querySelector("#scroll-section-1 .sticky-wrap"),
        stickyTxt: document.querySelector(
          "#scroll-section-1 .sticky-wrap .text"
        ),
        stickyBg: document.querySelector("#scroll-section-1 .sticky-wrap .bg"),
        stickyTag: document.querySelector("#scroll-section-1 .sticky-tag"),
        stickyPhone: document.querySelector("#scroll-section-1 .sticky-iphone"),
        stickyCircle: document.querySelector(
          "#scroll-section-1 .sticky-circle"
        ),
      },
      values: {
        stickyStartRatio: 0,
        stickyTxt_opacity: [1, 0, { start: 0.5, end: 0.6 }],
        stickyTxt_translateY: [0, -20, { start: 0.5, end: 0.6 }],
        stickyTag_opacity: [0, 1, { start: 0.4, end: 0.5 }],
        stickyTag_translateY: [0, 10, { start: 0.5, end: 0.6 }],
        stickyPhone_opacity: [0, 1, { start: 0.4, end: 0.5 }],
        stickyPhone_translateY: [0, -10, { start: 0.5, end: 0.6 }],
        stickyCircle_opacity: [0, 1, { start: 0.6, end: 0.7 }],
        stickyCircle_scale: [0.5, 1, { start: 0.6, end: 0.7 }],
        stickyCircle_opacity_out: [1, 0.5, { start: 0.7, end: 0.8 }],
      },
    },
    {
      // 2
      type: "normal",
      heightNum: 0,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        buttons: document.querySelectorAll(".cardBtn"),
      },
      values: {
        bottomBg_opacity: [0, 0.3, { start: 0.8, end: 1 }],
        bottomBg_scale: [0.5, 0.65, { start: 0.8, end: 1 }],
        bottomTit_opacity: [0, 0.3, { start: 0.8, end: 1 }],
        bottomTit_translateY: [0, -6, { start: 0.8, end: 1 }],
        bottomBtn_opacity: [0, 0.3, { start: 0.8, end: 1 }],
        bottomBtn_translateY: [0, -6, { start: 0.8, end: 1 }],
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 3,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
        topWrap: document.querySelector("#scroll-section-3 .top-wrap"),
        stickyWrap: document.querySelector("#scroll-section-3 .sticky-wrap"),
        bottomBg: document.querySelector("#scroll-section-3 .bottom-tit-bg"),
        bottomTit: document.querySelector("#scroll-section-3 .bottom-tit"),
        bottomBtn: document.querySelector("#scroll-section-3 .bottom-button"),
      },
      values: {
        bottomBg_opacity: [0.3, 1, { start: 0, end: 0.35 }],
        bottomBg_scale: [0.65, 1, { start: 0, end: 0.35 }],
        bottomTit_opacity: [0.3, 1, { start: 0, end: 0.35 }],
        bottomTit_translateY: [-6, -20, { start: 0, end: 0.35 }],
        bottomBtn_opacity: [0.3, 1, { start: 0, end: 0.35 }],
        bottomBtn_translateY: [-6, -20, { start: 0, end: 0.35 }],
      },
    },
  ];

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImagesCount; i++) {
      imgElem = new Image();
      imgElem.src = `./images/main/top/img_${i}.jpg?v=1`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
  }
  setCanvasImages();

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight =
          sceneInfo[i].heightNum * document.documentElement.clientHeight;
        sceneInfo[
          i
        ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
    }

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    document.querySelector(".sticky-circle").style.marginTop = `-${
      document.querySelector(".sticky-circle").offsetHeight / 5
    }px`;
  }

  function calcValues(values, currentYOffset) {
    let rv;
    //현재 씬 (스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      //start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        (currentYOffset >= partScrollStart) &
        (currentYOffset <= partScrollEnd)
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    const tl = new TimelineMax();
    const tl1 = new TimelineMax();
    const tl2 = new TimelineMax();
    const tl3 = new TimelineMax();
    const tl4 = new TimelineMax();

    switch (currentScene) {
      case 0:
        objs.canvas.style.opacity = calcValues(
          values.canvas_opacity_out,
          currentYOffset
        );
        break;
      case 1:
        if (scrollRatio < values.stickyStartRatio - 0.2) {
          tl.pause(0, false);
          tl.clear()
            .to("#scroll-section-1 .icon-area", 0.5, { opacity: 0, y: 0 })
            .play(0, false);
        } else {
          tl.pause(0, false);
          tl.clear()
            .to("#scroll-section-1 .icon-area", 0.5, { opacity: 1, y: -50 })
            .play(0, false);
        }

        if (!values.stickyStartRatio) {
          values.stickyStartRatio = objs.stickyWrap.offsetTop / scrollHeight;
          Object.keys(values).map((value) => {
            if (value === "stickyStartRatio") return;
            else if (
              value === "stickyTag_opacity" ||
              value === "stickyPhone_opacity"
            ) {
              values[value][2].start = values.stickyStartRatio;
              values[value][2].end = values.stickyStartRatio + 0.1;
            } else if (
              value === "stickyCircle_opacity" ||
              value === "stickyCircle_scale"
            ) {
              values[value][2].start = values.stickyStartRatio + 0.2;
              values[value][2].end = values.stickyStartRatio + 0.3;
            } else if (value === "stickyCircle_opacity_out") {
              values[value][2].start = values.stickyStartRatio + 0.3;
              values[value][2].end = values.stickyStartRatio + 0.4;
            } else {
              values[value][2].start = values.stickyStartRatio + 0.1;
              values[value][2].end = values.stickyStartRatio + 0.2;
            }
          });
        }

        const prevAreaHeight = objs.topWrap.offsetHeight + 300;
        const remainSection1 =
          scrollHeight - currentYOffset - document.documentElement.clientHeight;
        if (scrollRatio > values.stickyStartRatio) {
          objs.stickyWrap.classList.add("sticky");
          if (remainSection1 <= 0) {
            objs.stickyWrap.classList.remove("sticky");
            if (setHeightOnce1) {
              objs.stickyWrap.style.marginTop = `${
                currentYOffset - prevAreaHeight
              }px`;
              setHeightOnce1 = false;
            }
          } else {
            objs.stickyWrap.classList.add("sticky");
            objs.stickyWrap.style.marginTop = "0px";
            setHeightOnce1 = true;
          }
        } else {
          objs.stickyWrap.classList.remove("sticky");
        }

        objs.stickyTxt.style.opacity = calcValues(
          values.stickyTxt_opacity,
          currentYOffset
        );
        objs.stickyTxt.style.transform = `translate3d(0, ${calcValues(
          values.stickyTxt_translateY,
          currentYOffset
        )}%, 0)`;
        objs.stickyTag.style.opacity = calcValues(
          values.stickyTag_opacity,
          currentYOffset
        );
        objs.stickyTag.style.transform = `translate3d(0, ${calcValues(
          values.stickyTag_translateY,
          currentYOffset
        )}%, 0)`;
        objs.stickyPhone.style.opacity = calcValues(
          values.stickyPhone_opacity,
          currentYOffset
        );
        objs.stickyPhone.style.transform = `translate3d(0, ${calcValues(
          values.stickyPhone_translateY,
          currentYOffset
        )}%, 0)`;
        objs.stickyCircle.style.transform = `translateX(-50%) scale(${calcValues(
          values.stickyCircle_scale,
          currentYOffset
        )})`;

        if (scrollRatio <= 0.7) {
          objs.stickyCircle.style.opacity = calcValues(
            values.stickyCircle_opacity,
            currentYOffset
          );
        } else {
          objs.stickyCircle.style.opacity = calcValues(
            values.stickyCircle_opacity_out,
            currentYOffset
          );
        }

        if (scrollRatio >= 0.9) {
          tl1.pause(0, false);
          tl1
            .clear()
            .to("#scroll-section-2 .card1", 0.5, { opacity: 1, y: -20 })
            .play(0, false);
        } else {
          tl1.pause(0, false);
          tl1
            .clear()
            .to("#scroll-section-2 .card1", 0.5, { opacity: 0, y: 0 })
            .play(0, false);
        }

        break;
      case 2:
        if (scrollRatio >= 0) {
          tl2.pause(0, false);
          tl2
            .clear()
            .to("#scroll-section-2 .card2", 0.5, { opacity: 1, y: -20 })
            .play(0, false);
        } else {
          tl2.pause(0, false);
          tl2
            .clear()
            .to("#scroll-section-2 .card2", 0.5, { opacity: 0, y: 0 })
            .play(0, false);
        }

        if (scrollRatio >= 0.3) {
          tl3.pause(0, false);
          tl3
            .clear()
            .to("#scroll-section-2 .card3", 0.5, { opacity: 1, y: -20 })
            .play(0, false);
        } else {
          tl3.pause(0, false);
          tl3
            .clear()
            .to("#scroll-section-2 .card3", 0.5, { opacity: 0, y: 0 })
            .play(0, false);
        }

        if (scrollRatio >= 0.5) {
          tl4.pause(0, false);
          tl4
            .clear()
            .to("#scroll-section-2 .card4", 0.5, { opacity: 1, y: -20 })
            .play(0, false);
        } else {
          tl4.pause(0, false);
          tl4
            .clear()
            .to("#scroll-section-2 .card4", 0.5, { opacity: 0, y: 0 })
            .play(0, false);
        }

        sceneInfo[3].objs.bottomBg.style.opacity = calcValues(
          values.bottomBg_opacity,
          currentYOffset
        );
        sceneInfo[3].objs.bottomBg.style.transform = `scale(${calcValues(
          values.bottomBg_scale,
          currentYOffset
        )})`;
        sceneInfo[3].objs.bottomTit.style.opacity = calcValues(
          values.bottomTit_opacity,
          currentYOffset
        );
        sceneInfo[3].objs.bottomTit.style.transform = `translate3d(0, ${calcValues(
          values.bottomTit_translateY,
          currentYOffset
        )}%, 0)`;
        sceneInfo[3].objs.bottomBtn.style.opacity = calcValues(
          values.bottomBtn_opacity,
          currentYOffset
        );
        sceneInfo[3].objs.bottomBtn.style.transform = `translate3d(0, ${calcValues(
          values.bottomBtn_translateY,
          currentYOffset
        )}%, 0)`;

        break;
      case 3:
        objs.bottomBg.style.opacity = calcValues(
          values.bottomBg_opacity,
          currentYOffset
        );
        objs.bottomBg.style.transform = `scale(${calcValues(
          values.bottomBg_scale,
          currentYOffset
        )})`;
        objs.bottomTit.style.opacity = calcValues(
          values.bottomTit_opacity,
          currentYOffset
        );
        objs.bottomTit.style.transform = `translate3d(0, ${calcValues(
          values.bottomTit_translateY,
          currentYOffset
        )}%, 0)`;
        objs.bottomBtn.style.opacity = calcValues(
          values.bottomBtn_opacity,
          currentYOffset
        );
        objs.bottomBtn.style.transform = `translate3d(0, ${calcValues(
          values.bottomBtn_translateY,
          currentYOffset
        )}%, 0)`;

        if (scrollRatio <= 0.5) {
          objs.stickyWrap.style.position = "fixed";
          objs.stickyWrap.style.top = `10vh`;
          objs.stickyWrap.style.bottom = `auto`;
          objs.container.style.height = `${scrollHeight}px`;
          setHeightOnce3 = true;
        } else {
          objs.stickyWrap.style.position = "absolute";
          objs.stickyWrap.style.top = `auto`;
          objs.stickyWrap.style.bottom = `0px`;
          if (setHeightOnce3) {
            objs.container.style.height = `${
              objs.stickyWrap.offsetHeight + currentYOffset
            }px`;
            setHeightOnce3 = false;
          }
        }

        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (
      delayedYOffset >
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      enterNewScene = true;
      if (currentScene < sceneInfo.length - 1) currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (delayedYOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return; //ios 바운스 방지
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (currentScene === sceneInfo.length - 1) {
      document.querySelector(".product-name img").src =
        "./images/header/logo2.png?v=0";
      document.querySelector(".down-btn img").src =
        "./images/header/icon_down2.png?v=0";
      document.querySelector(".menu-btn img").src =
        "./images/header/icon_menu2.png?v=0";
    } else {
      document.querySelector(".product-name img").src =
        "./images/header/logo.png?v=0";
      document.querySelector(".down-btn img").src =
        "./images/header/icon_down.png?v=0";
      document.querySelector(".menu-btn img").src =
        "./images/header/icon_menu.png?v=0";
    }

    if (enterNewScene) return;
    playAnimation();
  }

  function loop() {
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!enterNewScene) {
      if (currentScene === 0) {
        const currentYOffset = delayedYOffset - prevScrollHeight;
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        let sequence = Math.round(
          calcValues(values.imageSequence, currentYOffset)
        );
        if (objs.videoImages[sequence])
          objs.context.drawImage(objs.videoImages[sequence], 0, 0);
      }
    }
    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  window.addEventListener("load", () => {
    setTimeout(function () {
      scrollTo(0, 0);
    }, 100);
    setLayout();
    window.addEventListener("resize", setLayout);
    window.addEventListener("scroll", () => {
      yOffset = window.pageYOffset;
      scrollLoop();

      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });

    const cardMotion = (e, back) => {
      const tl = new TimelineMax();
      tl.to(e.target, 0.3, { transform: "scale(0.8)" })
        .to(e.target, 0.2, { transform: "scale(1)" })
        .set(e.target, {
          attr: { src: `images/main/card/${back ? "minus" : "plus"}.png` },
          onComplete: function () {
            back
              ? e.target.classList.add("back")
              : e.target.classList.remove("back");

            e.target.parentNode.previousElementSibling.style.display = back
              ? "block"
              : "none";
            e.target.parentNode.previousElementSibling.style.opacity = back
              ? 1
              : 0;
          },
        });
    };

    sceneInfo[2].objs.buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (e.target.classList.contains("back")) cardMotion(e, false);
        else cardMotion(e, true);
      });
    });

    document.querySelector(".modelBtn").addEventListener("click", (e) => {
      // const bottomBtn = e.target.parentNode.nextElementSibling.nextElementSibling.childNodes[0];
      const firstCardBtnImage = document.querySelectorAll(".cardBtn > img")[0];

      const tl = new TimelineMax();
      tl.to(e.target, 0.3, { transform: "scale(0.8)" })
        .to(e.target, 0.2, { transform: "scale(1)" })
        .set(firstCardBtnImage, {
          attr: { src: "images/main/card/minus.png" },
          onComplete: function () {
            firstCardBtnImage.classList.add("back");
            e.target.parentNode.nextElementSibling.style.display = "block";
            e.target.parentNode.nextElementSibling.style.opacity = 1;
          },
        });
    });

    document.querySelectorAll(".video-area div img").forEach((video, idx) => {
      video.addEventListener("click", () => openFullscreen(idx + 1));
    });
  });

  function openFullscreen(id) {
    var elem = document.getElementById(`myvideo${id}`);
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
    elem.currentTime = 0;
    elem.play();
  }

  document.onfullscreenchange = function (event) {
    if (event.target.offsetHeight < 10) event.target.pause();
    console.log(event);
  };
})();
