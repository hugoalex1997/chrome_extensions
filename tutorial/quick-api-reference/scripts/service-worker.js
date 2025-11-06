import "./sw-omnibox.js";
import "./sw-tips.js";

console.log("service-worker.js");

chrome.storage.local.get("apiSuggestions").then(({ apiSuggestions }) => {
  console.log("Stored API suggestions:", apiSuggestions);
});
