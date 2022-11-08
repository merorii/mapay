(() => {
  var swiper = new Swiper(".swiper-container", {
    slidesPerView: "auto",
    allowTouchMove: true,
  });

  let yOffset = 0; //window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞 에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true

  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId;
  let rafState;
  let stickyOut = false;

  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        message: document.querySelector("#scroll-section-0 .main-message"),
        service_top_text: document.querySelector(
          "#scroll-section-0 .service-top-text"
        ),
        iphoneImg: document.querySelector(
          "#scroll-section-0 .sticky-elem-canvas img.sticky-iphone"
        ),
        sticky_canvas: document.querySelector(
          "#scroll-section-0 .sticky-elem-canvas"
        ),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImagesCount: 180,
        imageSequence: [0, 179],
        message_opacity: [1, 0, { start: 0.1, end: 0.3 }],
        iphone_translateY: [100, 0, { start: 0.3, end: 0.6 }],
        next_iphone_translateY: [0, -90, { start: 0.8, end: 1 }],
      },
    },
    {
      // 1
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
        message: document.querySelector("#scroll-section-1 .desc-message"),
        iphone: document.querySelector("#scroll-section-1 .iphone"),
      },
      values: {
        message_opacity: [0, 1, { start: 0.2, end: 0.5 }],
        message_translateY: [30, 0, { start: 0.2, end: 0.5 }],
        message_translateY_out: [0, -150, { start: 0.8, end: 1 }],
        iphone_translateY: [-90, -100, { start: 0.2, end: 0.5 }],
        iphone_translateY_out: [-100, -220, { start: 0.8, end: 1 }],
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 6,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        message: document.querySelector("#scroll-section-2 .desc-message"),
        sticky_canvas: document.querySelector(
          "#scroll-section-2 .sticky-elem-canvas"
        ),
        canvas: document.querySelector("#video-canvas-1"),
        context: document.querySelector("#video-canvas-1").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImagesCount: 96,
        imageSequence: [0, 95],
        message_opacity: [0, 1, { start: 0.1, end: 0.3 }],
        message_translateY: [0, -30, { start: 0.1, end: 0.3 }],
        canvas_translateY_out: [-80, -300, { start: 0.7, end: 1 }],
        message_translateY_out: [-30, -400, { start: 0.7, end: 1 }],
        prev_iphone_translateY: [-220, -280, { start: 0, end: 0.1 }],
        iphone_translateY: [-280, -350, { start: 0.7, end: 1 }],
      },
    },
    {
      // 3
      type: "normal",
      heightNum: 0,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
      values: {},
    },
    {
      // 4
      type: "normal",
      heightNum: 0,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-4"),
      },
      values: {},
    },
  ];

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImagesCount; i++) {
      imgElem = new Image();
      imgElem.src = `./images/service/section0/circle/circle_${i}.jpg?v=1`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }

    let imgElem1;
    for (let i = 0; i < sceneInfo[2].values.videoImagesCount; i++) {
      imgElem1 = new Image();
      imgElem1.src = `./images/service/section2/circle/circle_${i}.jpg?v=1`;
      sceneInfo[2].objs.videoImages.push(imgElem1);
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
    sceneInfo[2].objs.context.drawImage(sceneInfo[2].objs.videoImages[0], 0, 0);
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

    const tl1 = new TimelineMax();
    const tl2 = new TimelineMax();
    const tl3 = new TimelineMax();
    const tl4 = new TimelineMax();

    switch (currentScene) {
      case 0:
        objs.message.style.opacity = calcValues(
          values.message_opacity,
          currentYOffset
        );
        objs.iphoneImg.style.transform = `translate3d(0, ${calcValues(
          values.iphone_translateY,
          currentYOffset
        )}%, 0)`;
        sceneInfo[1].objs.iphone.style.transform = `translate3d(0, ${calcValues(
          values.next_iphone_translateY,
          currentYOffset
        )}%, 0)`;

        const remainSection0 =
          scrollHeight - currentYOffset - window.innerHeight;
        if (remainSection0 > 0) {
          objs.sticky_canvas.style.marginTop = `0px`;
          objs.sticky_canvas.classList.add("c_fixed");
          objs.sticky_canvas.classList.remove("c_absolute");
          objs.service_top_text.style.position = "fixed";
          objs.service_top_text.style.top = `187px`;
          stickyOut = true;
        } else {
          objs.sticky_canvas.classList.remove("c_fixed");
          objs.sticky_canvas.classList.add("c_absolute");
          objs.service_top_text.style.position = "absolute";
          if (stickyOut) {
            objs.sticky_canvas.style.marginTop = `${
              scrollHeight - objs.sticky_canvas.offsetHeight
            }px`;
            objs.service_top_text.style.top = `${
              scrollHeight - objs.sticky_canvas.offsetHeight + 187
            }px`;
            stickyOut = false;
          }
        }

        break;
      case 1:
        if (scrollRatio < 0.8) {
          objs.message.style.opacity = calcValues(
            values.message_opacity,
            currentYOffset
          );
          objs.message.style.transform = `translate3d(0, ${calcValues(
            values.message_translateY,
            currentYOffset
          )}%, 0)`;
          objs.iphone.style.transform = `translate3d(0, ${calcValues(
            values.iphone_translateY,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.message.style.transform = `translate3d(0, ${calcValues(
            values.message_translateY_out,
            currentYOffset
          )}%, 0)`;
          objs.iphone.style.transform = `translate3d(0, ${calcValues(
            values.iphone_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        break;
      case 2:
        if (scrollRatio < 0.5) {
          sceneInfo[1].objs.iphone.style.transform = `translate3d(0, ${calcValues(
            values.prev_iphone_translateY,
            currentYOffset
          )}%, 0)`;
        } else {
          sceneInfo[1].objs.iphone.style.transform = `translate3d(0, ${calcValues(
            values.iphone_translateY,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio < 0.7) {
          objs.message.style.opacity = calcValues(
            values.message_opacity,
            currentYOffset
          );
          objs.message.style.transform = `translate3d(0, ${calcValues(
            values.message_translateY,
            currentYOffset
          )}%, 0)`;
        } else {
          objs.message.style.transform = `translate3d(0, ${calcValues(
            values.message_translateY_out,
            currentYOffset
          )}%, 0)`;
          objs.sticky_canvas.style.transform = `translate3d(0, ${calcValues(
            values.canvas_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio >= 0.8) {
          tl1.pause(0, false);
          tl1
            .clear()
            .to("#scroll-section-3 .card1", 0.5, { opacity: 1, y: -20 })
            .play(0, false);
        } else {
          tl1.pause(0, false);
          tl1
            .clear()
            .to("#scroll-section-3 .card1", 0.5, { opacity: 0, y: 0 })
            .play(0, false);
        }

        break;
      case 3:
        if (scrollRatio >= 0) {
          tl2.pause(0, false);
          tl2
            .clear()
            .to("#scroll-section-3 .card2", 0.5, { opacity: 1, y: -20 })
            .play(0, false);
        } else {
          tl2.pause(0, false);
          tl2
            .clear()
            .to("#scroll-section-3 .card2", 0.5, { opacity: 0, y: 0 })
            .play(0, false);
        }

        if (scrollRatio >= 0.3) {
          tl3.pause(0, false);
          tl3
            .clear()
            .to("#scroll-section-3 .card3", 0.5, { opacity: 1, y: -20 })
            .play(0, false);
        } else {
          tl3.pause(0, false);
          tl3
            .clear()
            .to("#scroll-section-3 .card3", 0.5, { opacity: 0, y: 0 })
            .play(0, false);
        }

        if (scrollRatio >= 0.5) {
          tl4.pause(0, false);
          tl4
            .clear()
            .to("#scroll-section-3 .card4", 0.5, { opacity: 1, y: -20 })
            .play(0, false);
        } else {
          tl4.pause(0, false);
          tl4
            .clear()
            .to("#scroll-section-3 .card4", 0.5, { opacity: 0, y: 0 })
            .play(0, false);
        }

        break;
      case 4:
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
      delayedYOffset <
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      if (currentScene === sceneInfo.length - 1)
        document.body.classList.remove("scroll-effect-end");
    }
    if (
      delayedYOffset >
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      enterNewScene = true;
      if (currentScene === sceneInfo.length - 1)
        document.body.classList.add("scroll-effect-end");
      if (currentScene < sceneInfo.length - 1) currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (delayedYOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return; //ios 바운스 방지
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;
    playAnimation();
  }

  function loop() {
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!enterNewScene) {
      if (currentScene === 0 || currentScene === 2) {
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

    document.querySelector(".iphone-pop").addEventListener("click", (e) => {
      const tl = new TimelineMax();
      tl.to(e.target, 0.2, { transform: "scale(0.8)" })
        .to(e.target, 0.2, { transform: "scale(1.3)" })
        .to(e.target, 0.2, {
          transform: "scale(1)",
          onComplete: function () {
            document.querySelector(".model-pop").style.opacity = 1;
            document.querySelector(".model-pop").style.visibility = "visible";
            document.querySelector(".model-pop-content").style.transform =
              "scale(1)";
          },
        });
    });

    document.querySelector(".close-pop").addEventListener("click", () => {
      document.querySelector(".model-pop").style.opacity = 0;
      document.querySelector(".model-pop").style.visibility = "hidden";
      document.querySelector(".model-pop-content").style.transform = "scale(0)";
    });
  });
})();
