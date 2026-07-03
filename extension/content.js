console.log("DSA Tracker Extension Connected");

chrome.storage.local.get(
  ["dsaTrackerToken"],
  ({ dsaTrackerToken }) => {

      fetch(...,{
          headers:{
             Authorization:`Bearer ${dsaTrackerToken}`
          }
      })

});
const observer = new MutationObserver(() => {

  let isAccepted = false;

  // -----------------------------
  // LEETCODE DETECTION
  // -----------------------------
  const leetcodeAcceptedElement = document.querySelector(
    '[data-e2e-locator="submission-result"]'
  );

  if (
    leetcodeAcceptedElement &&
    leetcodeAcceptedElement.innerText.trim() === "Accepted"
  ) {

    isAccepted = true;

    const match = window.location.pathname.match(
      /\/problems\/([^/]+)\//
    );

    if (!match) return;

    const slug = match[1];

    const cleanTitle = slug
      .split("-")
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    syncProblem({
      problemName: cleanTitle,
      platform: "LeetCode",
      difficulty: getLeetCodeDifficulty(),
      link: window.location.href
    });
  }

  // -----------------------------
  // GFG DETECTION
  // -----------------------------
  const gfgSuccessElement = Array.from(
    document.querySelectorAll("h3")
  ).find(el =>
    el.innerText.includes("Problem Solved Successfully")
  );

  if (gfgSuccessElement) {

    isAccepted = true;

    const problemTitleElement = document.querySelector(
      "h3.g-m-0"
    );

    if (!problemTitleElement) return;

    const cleanTitle =
      problemTitleElement.innerText.trim();

    syncProblem({
      problemName: cleanTitle,
      platform: "GeeksForGeeks",
        difficulty: getGFGDifficulty(),
      link: window.location.href
    });
  }

  // Stop observer after successful sync detection
  if (isAccepted) {
    observer.disconnect();
  }

});

// -----------------------------
// SYNC FUNCTION
// -----------------------------
function syncProblem(problemData) {

  console.log("Problem Data:", problemData);

  fetch("http://localhost:5050/api/dsa/add", {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${dsaTrackerToken}`
    },

    body: JSON.stringify(problemData)

  })
  .then(res => res.json())
  .then(data => {
    console.log("Problem synced:", data);
  })
  .catch(err => {
    console.error("Sync error:", err);
  });

}
// -----------------------------
// DIFFICULTY DETECTION
// -----------------------------

function getLeetCodeDifficulty() {
  const difficultyElement = document.querySelector(
    "[class*='text-difficulty-']"
  );

  if (!difficultyElement) {
    return "Unknown";
  }

  return difficultyElement.innerText.trim();
}

function getGFGDifficulty() {
  const spans = document.querySelectorAll("span");

  for (const span of spans) {
    if (span.innerText.startsWith("Difficulty:")) {

      const strong = span.querySelector("strong");

      if (strong) {
        return strong.innerText.trim();
      }
    }
  }

  return "Unknown";
}
// Observe dynamic DOM updates
observer.observe(document.body, {
  childList: true,
  subtree: true
});