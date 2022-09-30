var shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function format(date) {
  return date.toISOString().split("T")[0];
}

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
  const prioColors = ["rgba(247, 220, 111, 0.4)", "rgba(248, 196, 113, 0.4)", "rgba(240, 178, 122, 0.4)", "rgba(241, 148, 138, 0.4)"];

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
      var extrafields = item.querySelectorAll(".ghx-extra-fields .ghx-extra-field-row");
      if (typeof extrafields !== "undefined") {
        var dueDate = extrafields[1];

        if (dueDate) {
          if (dueDate.innerText !== "None" && dueDate.innerText !== undefined) {
            var status = extrafields[0] ? extrafields[0].innerText : "";
            if (dueDate.innerText === date && status !== "Closed" && status !== "Requires Acceptance") {
              item.style.backgroundColor = level;
            } else {
              if (dueDate.innerText === date) {
                item.style.backgroundColor = "rgba(222, 255, 173, 0.3)";
              }
            }
          } else {
            //console.log(extrafields[0]);
            if (extrafields[0]) {
              extrafields[0].parentElement.remove();
            }
          }
        } else {
          //console.log(extrafields[0]);
          if (extrafields[0]) {
            extrafields[0].parentElement.remove();
          }
        }
      }
      // epic smaller
      const epicElement = item.querySelector(".ghx-highlighted-field>span");
      if (epicElement) {
        epicElement.style.fontSize = "10px";
      }
      const daysStatus = item.querySelector(".ghx-days b");
      // story name bold
      //if(item.querySelector(".ghx-summary>span")) {
      //	item.querySelector(".ghx-summary>span").style.fontWeight = "bold";
      //}
      // days in status - biger
      if (daysStatus) {
        daysStatus.style.height = "10px";
      }
      //item.style.fontWeight = "bold"
    });
  }
}

chrome.storage.sync.get(["sprintStartDate", "sprintDays", "boardUrl"], function (result) {
  if (!result.boardUrl) {
    alert("Go to Settings to setup Board Url");
    return;
  }
  if (!window.location.href.startsWith(result.boardUrl)) {
    console.info("change location %o => %o", window.location.href, result.boardUrl);
    window.open(result.boardUrl);
    return;
  }

  setTimeout(() => {
    const today = new Date();
    const sprintStart = result.sprintStartDate || format(today);
    const sprintStartDate = new Date(sprintStart);

    const sprintDays = parseInt(result.sprintDays || 14);
    const sprintEndDate = new Date(sprintStart);
    sprintEndDate.setDate(sprintEndDate.getDate() + sprintDays);
    sprintEndDate.setHours(sprintEndDate.getHours() + 23);
    if (sprintEndDate.getTime() < today.getTime()) {
      console.warn("sprintEndDate %o", format(sprintEndDate));
      // TODO auto update sprintStartDate = sprintEndDate;
      alert(`Sprint ended on ${format(sprintEndDate)}. Use settings to Update sprint Start Date...`);
    }

    document.querySelectorAll(".ghx-column-headers li:last-child")[0].remove();
    document.querySelectorAll(".ghx-columns li:last-child")[0].remove();

    const days = getDaysArray(sprintStartDate, today);
    viewStories(days);
  }, 100);
});
