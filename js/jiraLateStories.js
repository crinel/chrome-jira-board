var shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getDaysArray(start, end) {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        var d = new Date(dt);
        var y = d.getFullYear().toString().substr(2);
        var day = d.getDate().toString().length === 1 ? "0" + d.getDate().toString() : d.getDate().toString();
        arr.unshift(day + "/" + shortMonthNames[d.getMonth()] + "/" + y);
    }
    return arr;
}

function viewStories(daylist) {
    var prioColors = [];
    prioColors[3] = "rgba(241, 148, 138, 0.4)";
    prioColors[2] = "rgba(240, 178, 122, 0.4)";
    prioColors[1] = "rgba(248, 196, 113, 0.4)";
    prioColors[0] = "rgba(247, 220, 111, 0.4)";

    daylist.forEach((day, index) => {
        switch (index) {
            case 0:
            case 1:
            case 2:
                colorTable(day, prioColors[index]);
                break;
            default:
                colorTable(day, prioColors[3]);
                break;
        }
    });

    const detailsView = document.getElementById("ghx-detail-view");
    if (detailsView) {
        detailsView.remove();
    }

    function colorTable(date, level) {
        //console.log("date and level ", date, level);

        document.querySelectorAll(".ghx-columns .ghx-issue").forEach(item => {
            var extrafields = item.querySelectorAll(".ghx-extra-field-content");
            if (typeof extrafields !== "undefined") {
                var dueDate = extrafields[1];

                if (dueDate) {
                    if (dueDate.innerText !== "None" && dueDate.innerText !== undefined) {
                        var status = extrafields[0] ? extrafields[0].innerText : "";
                        if (dueDate.innerText === date && status !== "IN QA" && status !== "REVIEW" && status !== "QA READY") {
                            item.style.backgroundColor = level;
                        } else {
                            if (dueDate.innerText === date) {
                                item.style.backgroundColor = "rgba(222, 255, 173, 0.3)";
                            }
                        }
                    } else {
                        console.log(extrafields[0]);
                        if (extrafields[0]) {
                            extrafields[0].parentElement.remove();
                        }
                    }
                } else {
                    console.log(extrafields[0]);
                    if (extrafields[0]) {
                        extrafields[0].parentElement.remove();
                    }
                }
            }
            // epic smaller
            if (item.querySelector(".ghx-highlighted-field>span")) {
                item.querySelector(".ghx-highlighted-field>span").style.fontSize = "10px";
            }
            // story name bold
            //if(item.querySelector(".ghx-summary>span")) {
            //	item.querySelector(".ghx-summary>span").style.fontWeight = "bold";
            //}
            // days in status - biger
            if (item.querySelector(".ghx-days b")) {
                item.querySelector(".ghx-days b").style.height = "10px";
            }
            //item.style.fontWeight = "bold"
        });
    }
}

chrome.storage.sync.get(["sprintStartDate", "boardUrl"], function (result) {
    if (!result.boardUrl) {
        alert("Go to Settings first time.");
        return;
    }
    if (!window.location.href.startsWith(result.boardUrl)) {
        console.info("location", window.location.href);
        window.open(result.boardUrl);
        return;
    }

    setTimeout(() => {
        const sprintStartDate = result.sprintStartDate || new Date().toISOString().split("T")[0];
        const days = getDaysArray(new Date(sprintStartDate), new Date());
        viewStories(days);
    }, 100);
});
