function onPasswordChange() {
    var inputPassword = document.getElementById('password');
    var inputConfirmPassword = document.getElementById('confirmPassword');

    if (!inputPassword.value) {
        toastr.warning('Password cannot be empty', 'Warning');
    }
    else if (inputPassword.value != inputConfirmPassword.value) {
        toastr.warning('Passwords are not equal', 'Warning');
    }
    else {
        fetch('/api/User/password-update', {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': getJwtHeader(getJwtToken())
            },
            body: JSON.stringify({
                UserId: getUserid(),
                NewPassword: inputPassword.value,
                isAdmin: isAdmin()
            })
        })
            .then((response) => {
                if (response.ok) {
                    toastr.success(
                        'Password changed',
                        'Success',
                        {
                            timeOut: 2000,
                            fadeOut: 1000,
                            onHidden: function () {
                                window.location.href = "index.html";
                            }
                        }
                    )
                }
                else {
                    toastr.error('Password change failed', 'Error');
                }
            })
            .catch((error) => {
                alert(error);
            });
    }
}

function createChangePasswordForm() {
    /* Title. */
    var mainTitle = document.createElement('h1');
    mainTitle.innerText = 'Change password';

    var main = document.getElementById('main');
    main.innerHTML = '';
    main.appendChild(mainTitle);

    /* Password. */
    var labelPassword = document.createElement('label');
    labelPassword.innerText = 'New password';

    var inputPassword = document.createElement('input');
    inputPassword.id = 'password';
    inputPassword.type = 'password';

    var divPassword = document.createElement('div');
    divPassword.appendChild(labelPassword);
    divPassword.innerHTML += '<br>';
    divPassword.appendChild(inputPassword);

    /* Confirm Password. */
    var labelConfirmPassword = document.createElement('label');
    labelConfirmPassword.innerText = 'Confirm password';

    var inputConfirmPassword = document.createElement('input');
    inputConfirmPassword.id = 'confirmPassword';
    inputConfirmPassword.type = 'password';

    var divConfirmPassword = document.createElement('div');
    divConfirmPassword.innerHTML += '<br>';
    divConfirmPassword.appendChild(labelConfirmPassword);
    divConfirmPassword.innerHTML += '<br>';
    divConfirmPassword.appendChild(inputConfirmPassword);

    /* Change button. */
    var submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Change';

    var divButton = document.createElement('div');
    divButton.innerHTML += '<br>';
    divButton.appendChild(submitButton);

    /* Login form. */
    var loginForm = document.createElement('form');
    loginForm.action = 'javascript:onPasswordChange()';
    loginForm.appendChild(divPassword);
    loginForm.appendChild(divConfirmPassword);
    loginForm.appendChild(divButton);

    main.appendChild(loginForm);
}

