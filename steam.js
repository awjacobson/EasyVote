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

function getFunc(url) {
    console.log("getFunc url:", url);
    if (url.startsWith('https://steamcommunity.com/openid/loginform')) {
        return steamLoginFormPageHandler;
    } else if (url.startsWith('https://steamcommunity.com/openid/login')) {
        steamLoginPageHandler();
    }
    return null;
}

const func = getFunc(window.location.href);
if (func) { func(); }
