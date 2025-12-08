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
    const agreeCheckbox = document.querySelector("input[type='checkbox'][name='accept'], input[type='checkbox'][name='sharedAccept']");
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

function hasError() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const error = urlParams.get('error');

    if (error !== null) {
        // You have already voted for this server today.
        // ?error=2&time=1764513195&fallbackcaptcha=
        // do not continue

        // You have reached your daily vote limit.
        // ?error=9&time=&fallbackcaptcha=
        // do not continue

        // You need to accept our Privacy Policy to vote.
        // ?error=10&time=&fallbackcaptcha=
        // do not continue

        // Authentication data mismatch detected.
        // ?error=11&time=&fallbackcaptcha=
        // do not continue
        return true;
    }

    return false;
}

function votingPageHandler() {
    sleep(1000).then(() => {
        clickThirdPartyButton();
        clickVoteButton();
        waitForElementToExist("input[type='checkbox'][name='accept'], input[type='checkbox'][name='sharedAccept']").then(element => {
            if (hasError()) {
                return;
            }
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

function contentMessageHandler(message, sender, sendResponse) {
    console.log("contentMessageHandler", message);
    if (message.action === "beginVoting") {
        votingPageHandler()
    }
}
        
chrome.runtime.onMessage.addListener(contentMessageHandler);
