(function () {
  chrome.storage.sync.get(["sprintStartDate", "boardUrl"], function (result) {
    const defaultDate = result.sprintStartDate || new Date().toISOString().split("T")[0];
    const sprintStartDate = prompt("Please enter sprint Start Date (yyyy-mm-dd)", defaultDate);

    const defaultSprintDays = result.sprintDays || 14;
    const sprintDays = prompt("Please sprint Days (14)", defaultSprintDays);

    const defaultUrl = result.boardUrl || "https://jira.com/";
    const boardUrl = prompt("Please enter Board URL", defaultUrl);

    chrome.storage.sync.set(
      {
        sprintStartDate: sprintStartDate,
        sprintDays: sprintDays,
        boardUrl: boardUrl
      },
      function () {
        console.log(" URL updated : %o", boardUrl);
        console.log("Date updated : %o (%o days)", sprintStartDate, sprintDays);
      }
    );
  });
})();
