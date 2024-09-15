(function () {
    var splitBoards = document.querySelectorAll(".splitboard");
    if (!splitBoards) return;
    splitBoards.forEach(function (splitBoard) {
        setTimeout(function () {
            var iframeElm = splitBoard.querySelector("iframe");
            if (iframeElm) {
                var isSafari =
                    navigator.userAgent.indexOf("safari") > -1 &&
                    navigator.userAgent.indexOf("chrome") == -1;
                if (isSafari) {
                    function onMouseMove(event) {
                        var viewportOffset = splitBoard.getBoundingClientRect();
                        if (
                            !(
                                event.clientY > viewportOffset.top + 15 &&
                                event.clientY < viewportOffset.bottom - 15
                            )
                        ) {
                            onMouseleave();
                        }
                    }
                    function onMouseenter(event) {
                        splitBoard.classList.add("active");
                        iframeElm.style.pointerEvents = null;
                        splitBoard.addEventListener(
                            "mousemove",
                            onMouseMove,
                            false
                        );
                    }
                    splitBoard.addEventListener("mouseover", onMouseenter);
                    function onMouseleave(event) {
                        splitBoard.classList.remove("active");
                        iframeElm.style.pointerEvents = "none";
                        splitBoard.removeEventListener("mousemove", onMouseMove);
                    }
                    splitBoard.addEventListener("mouseleave", onMouseleave);
                }
            }
        }, 2000);
    });
})();