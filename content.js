(function() {
    // Ensure we are strictly on the login page
    if (!window.location.href.includes("e-learning.lagh-univ.dz/login/index.php")) {
        return;
    }

    // If the user is already logged in, Moodle usually adds the 'loggedin' class to the body
    if (document.body.classList.contains('loggedin')) {
        return;
    }

    // Detect if there is a login error on the page to prevent infinite submission loops
    // Moodle typically displays errors in elements with these classes/IDs
    const errorSelectors = [
        '.loginerrors',
        '.alert-danger',
        '.error',
        '#loginerrormessage',
        '.text-danger',
        '#notice'
    ];

    let hasError = false;
    for (const selector of errorSelectors) {
        const el = document.querySelector(selector);
        if (el && el.innerText && el.innerText.trim().length > 0) {
            // Ensure it's actually visible
            if (el.offsetParent !== null || window.getComputedStyle(el).display !== 'none') {
                hasError = true;
                break;
            }
        }
    }

    if (hasError) {
        console.log("Lagh-Univ Auto Login: Login error detected. Auto-submit disabled to prevent infinite loop.");
    }

    // Retrieve credentials from Chrome storage
    chrome.storage.local.get(['username', 'password'], function(result) {
        if (result.username && result.password) {
            const usernameField = document.getElementById('username');
            const passwordField = document.getElementById('password');
            const loginBtn = document.getElementById('loginbtn');

            if (usernameField && passwordField && loginBtn) {
                // Fill credentials
                usernameField.value = result.username;
                // Dispatch events to ensure Moodle's JS registers the input values
                usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                usernameField.dispatchEvent(new Event('change', { bubbles: true }));

                passwordField.value = result.password;
                passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                passwordField.dispatchEvent(new Event('change', { bubbles: true }));

                // Only auto-submit if there are no errors on the page
                if (!hasError) {
                    // Small delay to allow the DOM and Moodle's RequireJS to fully process the inputs
                    setTimeout(() => {
                        loginBtn.click();
                    }, 400);
                } else {
                    console.log("Lagh-Univ Auto Login: Fields filled, but waiting for manual submission due to previous error.");
                }
            }
        }
    });
})();
