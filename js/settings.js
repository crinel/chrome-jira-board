(function () {
  chrome.storage.sync.get(["sprintStartDate", "boardUrl"], function (result) {
    const defaultDate = result.sprintStartDate || new Date().toISOString().split("T")[0];
    const sprintStartDate = prompt("Please enter sprint Start Date (yyyy-mm-dd)", defaultDate);

    const defaultUrl = result.boardUrl || "https://jira.com/";
    const boardUrl = prompt("Please enter Board URL", defaultUrl);
    chrome.storage.sync.set(
      {
        sprintStartDate: sprintStartDate,
        boardUrl: boardUrl
      },
      function () {
        console.log(" URL updated : ", boardUrl);
        console.log("Date updated : ", sprintStartDate);
      }
    );
  });
})();
