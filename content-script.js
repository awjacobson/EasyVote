function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clickThirdPartyButton() {
    const thirdPartyButton = document.getElementById("cookiescript_accept");
    console.log("thirdPartyButton", thirdPartyButton);
    if (thirdPartyButton) {
        thirdPartyButton.click();
    }
}

function clickVoteButton() {
    const voteButton = document.querySelector("a[title='Vote']");
    console.log("voteButton", voteButton);
    if (voteButton) {
        voteButton.click();
    }
}

function checkAgreeCheckbox() {
    const agreeCheckbox = document.querySelector("input[type='checkbox'][name='accept']");
    console.log("agreeCheckbox", agreeCheckbox);
    console.log("agreeCheckbox.checked", agreeCheckbox?.checked);
    /*
     * The checkbox may already be checked. Check that it is unchecked before
     * clicking it.
     */
    if (agreeCheckbox && agreeCheckbox?.checked === false) {
        agreeCheckbox.click();
    }
}

function clickSteamButton() {
    const form = document.querySelector("form[name='steam_form']");
    const steamButton = form.querySelector("input[type='image']");
    console.log("steamButton", steamButton);
    if (steamButton) {
        steamButton.click();
    }
}

function votingPageHandler() {
    sleep(1000).then(() => {
        clickThirdPartyButton();
        clickVoteButton();
        waitForElementToExist("input[type='checkbox'][name='accept']").then(element => {
            checkAgreeCheckbox();
            clickSteamButton();
        });
    });
}

function submitLoginForm() {
    const form = document.querySelector("form[class^='newlogindialog_LoginForm']");
    const signInButton = form.querySelector("button[type='submit']");
    console.log("signInButton", signInButton);
    if (signInButton) {
        signInButton.click();
    }
}

function submitLogin() {
    const form = document.querySelector("form[id='openidForm']");
    const signInButton = form.querySelector("input[type='submit']");
    console.log("signInButton", signInButton);
    if (signInButton) {
        signInButton.click();
    }
}

/**
 * The Steam login form is the form with a username and password field. It is
 * the first of two Steam screens the user sees.
 */
function steamLoginFormPageHandler() {
    /*
     * The form must be inject via javascript after the page is loaded.
     * Once the form is injected, it takes another moment for Google to populate the username and passowrd fields.
     */
    waitForElementToExist("form[class^='newlogindialog_LoginForm'] input[type='text']:not([value=''])").then(element => {
        submitLoginForm();
    });
}

/**
 * The Steam login page is the form with only a Sign In button. It is the
 * second of two Steam screens the user sees.
 */
function steamLoginPageHandler() {
    waitForElementToExist("form[id='openidForm']").then(element => {
        submitLogin();
    });
}

// https://7daystodie-servers.com/server/124884/
// https://7daystodie-servers.com/server/115464/vote/confirm/
function isVotingPage(url) {
    return /^https:\/\/(?:7daystodie-servers|conan-exiles|rust-servers|ark-servers|dayz-servers)\.(?:com|net|org)\/server\/\d{5,7}(?:\/){0,1}(?:vote){0,1}(?:\/){0,1}$/.test(url)
}
  
function getFunc(url) {
    if (isVotingPage(url)) {
        return votingPageHandler;
    } else if (url.startsWith('https://steamcommunity.com/openid/loginform')) {
        return steamLoginFormPageHandler;
    } else if (url.startsWith('https://steamcommunity.com/openid/login')) {
        steamLoginPageHandler();
    }
    return null;
}

const func = getFunc(window.location.href);
if (func) { func(); }
