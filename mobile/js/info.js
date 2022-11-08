(() => {

  function getParameterByName(name) { 
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"); 
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), 
        results = regex.exec(location.search); 
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " ")); 
  }

  window.addEventListener("load", () => {

    var info = getParameterByName('info');

    $.ajax({
      url: "https://operation-sync-mk1-prod.miraeassetpay.kr/api/terms/" + info,
      type: "GET",
      statusCode: {
        200: function (args) {
          var frame_height;
          document.querySelector("#info").contentWindow.document.body.innerHTML += args.data.contents;

              frame_height =
              document.querySelector(".contents").childNodes[1].contentWindow.document.body.scrollHeight + 200;
              document.querySelector(".contents").childNodes[1].style.height = frame_height + "px";
        },
      },
      error: function (err) {
        alert("네트워크 오류로 서버와의 통신이 실패하였습니다.");
      },
      cache: false,
    });
  });

})();
