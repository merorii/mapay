(() => {
    $.ajax({
        url: "https://ext-nice-epay.miraeassetpay.kr/api/faqs",
        type: "GET",
        statusCode: {
            200: function (args) {
                args.forEach((item, idx) => {
                    const element = `<div class="questionBox${idx === 0 ? ' first"' : '"'}>
                    <p class="question"><span class="q">Q</span>${item.data.title}</p>
                    <div class="plus">
                        <img src="images/faq/plus.png?v=0" alt="" />
                    </div>
                    </div>
                    <div class="answerBox ans${idx + 1} d-none">
                        <div class="answer">${item.data.contents}
                        ${ item.data.linkUrl ? '<a href="'+ item.data.linkUrl+'" target="_blank" class="faqlink">'+item.data.linkUrl+'</a>' : '' }
                        </div>
                    </div>`;

                    document.querySelector(".contents").insertAdjacentHTML("beforeend", element);
                });
                clickEvent();
            },
            400: function (err) {
                errorMessege(err);
            },
            404: function (err) {
                errorMessege(err);
            },
        },
        error: function (err) {
            //400과 404를 제외한 에러가 발생했을시
            if (err.status !== 400 && err.status !== 404) {
                alert("네트워크 오류로 서버와의 통신이 실패하였습니다.");
            }
        },
        cache: false,
    });

    function clickEvent() {
        const question = document.querySelectorAll(".questionBox");

        question.forEach(function (question, index) {
            question.addEventListener("click", function (e) {
                const idx = index + 1;
                question.classList.toggle("on");
                console.log("sss");
                if (question.classList.contains("on")) {
                    document.querySelector(".ans" + idx).classList.remove("d-none");
                    question.children[1].children[0].src = "images/faq/minus.png?v=0";
                } else {
                    document.querySelector(".ans" + idx).classList.add("d-none");
                    question.children[1].children[0].src = "images/faq/plus.png?v=0";
                }
            });
        });
    }

    function errorMessege(error) {
        var errText = "";
        error.responseJSON.errors.forEach(function (ele) {
            errText += ele.message + "\n";
        });
        alert(errText);
    }
})();
