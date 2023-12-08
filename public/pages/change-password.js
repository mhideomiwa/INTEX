let pwValid = false;
let pwConfirmValid = false;
let oldPwValid = false;

function validateNewPassword() {
    let pw = document.getElementById('new_password').value;
    if (pw === "" || pw === null) {
        document.getElementById('pwMessage').innerHTML = 'Password is required <br>';
        document.getElementById('pwMessage').style.color = 'red';
        document.getElementById('new_password').style.borderColor = 'red';
        pwValid = false;
    } else if (pw.length < 6) {
        document.getElementById('pwMessage').innerHTML = 'Password must be at least 6 characters long';
        document.getElementById('pwMessage').style.color = 'red';
        document.getElementById('new_password').style.borderColor = 'red';
        pwValid = false;
    } else if (pw.length >= 6) {
        document.getElementById('pwMessage').innerHTML = '';
        document.getElementById('new_password').style.borderColor = 'black';
        pwValid = true;
    }
    enableSubmit();
}

function validateNewPasswordConfirm() {
    let pw = document.getElementById('new_password').value;
    let pwConfirm = document.getElementById('password_confirm').value;
    if (pw !== pwConfirm) {
        document.getElementById('pwConfirmMessage').innerHTML = 'Passwords do not match';
        document.getElementById('pwConfirmMessage').style.color = 'red';
        document.getElementById('password_confirm').style.borderColor = 'red';
        pwConfirmValid = false;
    }

    else if (pwConfirm === pw) {
        document.getElementById('pwConfirmMessage').innerHTML = '';
        document.getElementById('password_confirm').style.borderColor = 'black';
        pwConfirmValid = true;
    }
    enableSubmit();
}

function validateOldPassword() {
    let oldPw = document.getElementById('old_password').value;
    if (oldPw === "" || oldPw === null) {
        // document.getElementById('oldPwMessage').innerHTML = '';
        // document.getElementById('oldPwMessage').style.color = 'red';
        // document.getElementById('old_password').style.borderColor = 'red';
        oldPwValid = false;
    } else if (oldPw.length < 6) {
        // document.getElementById('oldPwMessage').innerHTML = '';
        // document.getElementById('oldPwMessage').style.color = 'red';
        // document.getElementById('old_password').style.borderColor = 'red';
        oldPwValid = false;
    } else if (oldPw.length >= 6) {
        // document.getElementById('oldPwMessage').innerHTML = '';
        // document.getElementById('old_password').style.borderColor = 'black';
        oldPwValid = true;
    }
    enableSubmit();
}

function enableSubmit() {
    console.log('PwValid: ' + pwValid, 'PwConfirmValid: ' + pwConfirmValid, 'oldPwValid: ' + oldPwValid);
    if (pwValid && pwConfirmValid && oldPwValid) {
        document.getElementById('password_change_button').disabled = false;
    } else {
        document.getElementById('password_change_button').disabled = true;
    }
}
