
document.getElementById('container').addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.matches('#login-btn')) {
        var emailInput = document.getElementById('login-email-input');
        var pwdInput = document.getElementById('login-pwd-input');
        var data = {
            email: emailInput.value,
            password: pwdInput.value
        };
        Http.Post('/api/auth/login', data)
            .then((res) => {
                if (!res.ok) {
                    document.getElementById('login-error-message').innerText = 'Incorrect email or password'
                    return;
                }
                window.location.href = '/users';
            })
    } else if (event.target.matches('#signup-btn')) {
        var emailInput = document.getElementById('signup-email-input');
        var usernameInput = document.getElementById('signup-username-input');
        var pwdInput = document.getElementById('signup-pwd-input');
        var data = {
            user: {
                email: emailInput.value,
                name: usernameInput.value,
                password: pwdInput.value
            }
        };
        Http.Post('/api/auth/signup', data)
            .then((res) => {
                if (!res.ok) {
                    document.getElementById('signup-error-message').innerText = 'Email is already used'
                    return;
                }
                window.location.href = '/users';
            })
    } else if (event.target.matches('#to-create')) {
        const loginBlock = document.getElementById('login-block');
        const signupBlock = document.getElementById('signup-block');

        loginBlock.className = 'card invisible';
        signupBlock.className = 'card';
    } else if (event.target.matches('#to-login')) {
        const loginBlock = document.getElementById('login-block');
        const signupBlock = document.getElementById('signup-block');
        
        signupBlock.className = 'card invisible';
        loginBlock.className = 'card';
    }
}, false);
