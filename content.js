(function () {
    const LOGIN_PAGE = "e-learning.lagh-univ.dz/login/index.php";
    const isLoginPage = window.location.href.includes(LOGIN_PAGE);

    // If the user is already logged in, Moodle usually adds the 'loggedin' class to the body
    if (document.body.classList.contains('loggedin')) {
        return;
    }

    // Retrieve credentials + the new option flag from Chrome storage
    chrome.storage.local.get(['username', 'password', 'autoRedirect'], function (result) {

        // ---------------------------------------------------------------
        // NEW OPTION: On any other page of the site, if the guest
        // "Log in" link is present in the user menu, click it to get
        // redirected to the login page (where auto-fill/submit runs).
        // Can be disabled by setting { autoRedirect: false } in storage.
        // ---------------------------------------------------------------
        if (!isLoginPage) {
            if (result.autoRedirect === false) return; // option turned off

            // Matches: <div class="usermenu"><span class="login ..."><a href=".../login/index.php">
            const loginLink = document.querySelector('.usermenu .login a[href*="login/index.php"]');

            // Only redirect if we actually have credentials to auto-fill,
            // otherwise there's no point bouncing to the login page.
            if (loginLink && result.username && result.password) {
                console.log("Lagh-Univ Auto Login: 'Log in' menu link detected. Redirecting to login page...");
                loginLink.click();
            }
            return;
        }

        // ---------------------------------------------------------------
        // Existing login-page logic (unchanged)
        // ---------------------------------------------------------------

        // Detect if there is a login error on the page to prevent infinite submission loops
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

        if (result.username && result.password) {
            const usernameField = document.getElementById('username');
            const passwordField = document.getElementById('password');
            const loginBtn = document.getElementById('loginbtn');

            if (usernameField && passwordField && loginBtn) {
                // Fill credentials
                usernameField.value = result.username;
                usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                usernameField.dispatchEvent(new Event('change', { bubbles: true }));

                passwordField.value = result.password;
                passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                passwordField.dispatchEvent(new Event('change', { bubbles: true }));

                // Only auto-submit if there are no errors on the page
                if (!hasError) {
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
