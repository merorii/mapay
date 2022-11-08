(() => {
    var lastScrollTop = 0;
    var tl = new TimelineMax();
    var tl2 = new TimelineMax();
    var tl3 = new TimelineMax();

    function checkMenu() {
        const navHeight = document.getElementById("gn").offsetHeight;

        if (window.pageYOffset > navHeight) {
            document.body.classList.add("local-nav-sticky");
        } else {
            document.body.classList.remove("local-nav-sticky");
        }

        if (document.body.classList.contains("local-nav-sticky")) {
            var st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
                // down scroll
                if (!document.querySelector(".product-name").classList.contains("pe-none")) {
                    tl.pause(0, false);
                    tl.clear()
                        .add("m1")
                        .set(".local-nav-links a.product-name", { className: "+=pe-none" })
                        .to(".local-nav-links a:not(.product-name), .local-nav-links p", 0.3, { y: -20 }, "m1")
                        .to(".local-nav-links a.product-name", 0.3, { opacity: 0, y: -20 }, "m1")
                        .to(".moreMenu div", 0.3, { y: 0 }, "m1")
                        .play(0, false);
                }
            } else {
                // up scroll
                if (document.querySelector(".product-name").classList.contains("pe-none")) {
                    tl2.clear()
                        .add("m1")
                        .set(".local-nav-links a.product-name", { className: "-=pe-none" })
                        .to(".local-nav-links a:not(.product-name), .local-nav-links p", 0.3, { y: 0 }, "m1")
                        .to(".local-nav-links a.product-name", 0.3, { y: 0, opacity: 1 }, "m1")
                        .to(".moreMenu div", 0.3, { y: 0 }, "m1")
                        .play(0, false);
                }
            }

            lastScrollTop = st <= 0 ? 0 : st;
        }
    }

    document.querySelector(".menu-btn").addEventListener("click", () => {
        document.querySelector(".moreMenu").style.opacity = 1;
        document.querySelector(".moreMenu").style.visibility = "visible";
    });

    document.querySelector(".moreMenu .exit-btn").addEventListener("click", () => {
        document.querySelector(".moreMenu").style.opacity = 0;
        setTimeout(() => {
            document.querySelector(".moreMenu").style.visibility = "hidden";
        }, 100);
    });

    window.addEventListener("load", () => {
        document.body.classList.remove("before-load");
        window.addEventListener("scroll", () => {
            checkMenu();
        });

        const moveX =
            document.querySelector(".global-nav-links div p").offsetWidth -
            document.querySelector(".global-nav-links div").offsetWidth;
        tl3.to(".global-nav-links div p", 4, { x: -(moveX + 50), delay: 2, ease: Linear.easeNone })
            .repeatDelay(1)
            .repeat(-1);
    });

    $.ajax({
        url: "https://operation-sync-mk1-prod.miraeassetpay.kr/api/terms",
        type: "GET",
        statusCode: {
            200: function (args) {
            var html= '';
            args.data.map(seq => {
                html += '<li class="optionItem" data-value="'+seq.termId+'">'+seq.title+'</li>';
            })
            document.getElementsByClassName('optionList')[0].innerHTML = html;
    
    
            infoEvent();
            },
        },
        error: function (err) {
            alert("네트워크 오류로 서버와의 통신이 실패하였습니다.");
        },
        cache: false,
    });
    
    function infoEvent(){
        const label = document.querySelector('.label');
        const options = document.querySelectorAll('.optionItem');
        const info = document.querySelector('.infoList');
    
        const handleSelect = (item) => {
            info.classList.remove('active');
            location.href = 'info.html?info='+item;
            //label.innerHTML = item.textContent;
        }
        
        // 옵션 클릭시 클릭한 옵션을 넘김
        options.forEach(option => {
            option.addEventListener('click', () => handleSelect(option.dataset.value))
        })

        // 라벨을 클릭시 옵션 목록이 열림/닫힘
        label.addEventListener('click', () => {
            if(info.classList.contains('active')) {
                info.classList.remove('active');
            } else {
                info.classList.add('active');
            }
        })
    }
})();
