function isVotingPage(url) {
    return /^https:\/\/(?:7daystodie-servers|conan-exiles|rust-servers|ark-servers|dayz-servers)\.(?:com|net|org)\/server\/\d{5,7}(?:\/){0,1}(?:vote){0,1}(?:\/){0,1}/.test(url)
}

function isSteamLoginPage(url) {
    return url.startsWith('https://steamcommunity.com/openid/loginform') ||
        url.startsWith('https://steamcommunity.com/openid/login');
}

chrome.webNavigation.onCompleted.addListener(async ({ tabId, url }) => {
    if (isSteamLoginPage(url)) {
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['common.js', 'steam.js' ]
        })
        .then(() => {
            console.log(`Injected steam.js into tab ${tabId}`);
        })
        .catch((error) => {
            console.error(`Error injecting steam.js into tab ${tabId}:`, error);
        });
    } else if (isVotingPage(url)) {
        /*
         * any time that any tab changes, we will fall into this block.
         * if the current tab is not completed then we will inject the vote.js script.
         */
        const status = determineVotingPageStatus(url);
        console.log(`Voting page status for URL ${url}: ${status}`);
        if (status === 'waiting' || status === 'processing') {
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['common.js', 'vote.js']
            });
        }

        /*
         * inspect the tabs for tabs with the same domain. If there are any tabs with
         * the same domain that are in 'waiting' or 'processing' state,
         */
        chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, function(tabs) {
            const sameDomainTabs = tabs.filter(tab => (new URL(tab.url).hostname === new URL(url).hostname));
            console.log('sameDomainTabs:', sameDomainTabs);

            const sameDomainNotCompleted = sameDomainTabs.filter(tab => {
                const tabStatus = determineVotingPageStatus(tab.url);
                return tabStatus === 'waiting' || tabStatus === 'processing';
            });
            console.log('sameDomainNotCompleted:', sameDomainNotCompleted);

            if (sameDomainNotCompleted.length > 0) {
                const nextTab = sameDomainNotCompleted[0];
                beginVoting(nextTab.id, nextTab.url);
            }
        });
    }
});

/*
 * returns 'waiting', 'processing', or 'completed', or undefined
 *
 * the different urls are:
 * https://dayz-servers.org/server/121736/              | initial load
 * https://dayz-servers.org/server/121736/vote/         | after clicking the vote button
 * ...                                                  | (steam pages)
 * https://dayz-servers.org/server/121736/vote/confirm/ | done voting
 * https://dayz-servers.org/server/121736/vote/?error=2&time=1765146299&fallbackcaptcha=1 | error page
 * 
 * known error codes:
 * 
 * You have already voted for this server today.
 * ?error=2&time=1764513195&fallbackcaptcha=
 *
 * You have reached your daily vote limit.
 * ?error=9&time=&fallbackcaptcha=
 * 
 * You need to accept our Privacy Policy to vote.
 * ?error=10&time=&fallbackcaptcha=
 *
 * Authentication data mismatch detected.
 * ?error=11&time=&fallbackcaptcha=
 */
function determineVotingPageStatus(url) {
    if (/\/server\/\d{5,7}\/vote\/confirm(?:\/){0,1}$/.test(url)) {
        return 'completed';
    }
    
    if (/\/server\/\d{5,7}\/vote\/\?error=\d{1,2}/.test(url)) {
        return 'completed';
    }

    if (/\/server\/\d{5,7}\/vote\/?$/.test(url)) {
        return 'processing';
    }

    if (/\/server\/\d{5,7}\/?$/.test(url)) {
        return 'waiting';
    }

    return undefined;
}

async function beginVoting(tabId, url) {
    console.log("beginVoting for tabId:", tabId, "url:", url);
    try {
        await chrome.tabs.sendMessage(tabId, { action: "beginVoting", url: url });
    } catch (error) {
        console.error("Error in beginVoting:", error);
    }
}
