function isVotingPage(url) {
  return /^https:\/\/(?:7daystodie-servers|conan-exiles|rust-servers|ark-servers|dayz-servers)\.(?:com|net|org)\/server\/\d{5,7}(?:\/){0,1}(?:vote){0,1}(?:\/){0,1}$/.test(url)
}

chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId, url }) => {
  if ( isVotingPage(url) ||
      url.startsWith('https://steamcommunity.com/openid/loginform') ||
      url.startsWith('https://steamcommunity.com/openid/login')) {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content-script.js']
    });
  }
});
