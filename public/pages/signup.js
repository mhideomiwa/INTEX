// TODO: Connect everything to the databases

// Variables for each field
let fNameValid = false;
let lNameValid = false;
let emailValid = false;
let userNameValid = false;
let pwValid = false;
let pwConfirmValid = false;

// Function to enable Sign Up button
function enableSubmit() {
    if (fNameValid && lNameValid && emailValid && userNameValid && pwValid && pwConfirmValid) {
        document.getElementById('signupbutton').disabled = false;
    } else {
        document.getElementById('signupbutton').disabled = true;
    }
}

// Function to validate first name
function validateFirstName() {
    let firstName = document.getElementById('user_first_name').value;
    if (firstName === "" || firstName === null) {
        document.getElementById('firstNameMessage').innerHTML = 'First name is required <br>';
        document.getElementById('firstNameMessage').style.color = 'red';
        document.getElementById('user_first_name').style.borderColor = 'red';
        fNameValid = false;
    } else if (firstName) {
        document.getElementById('firstNameMessage').innerHTML = '';
        document.getElementById('user_first_name').style.borderColor = 'black';
        fNameValid = true;
    }
    enableSubmit();
}

// Function to validate last name
function validateLastName() {
    let lastName = document.getElementById('user_last_name').value;
    if (lastName === "" || lastName === null) {
        document.getElementById('lastNameMessage').innerHTML = 'Last name is required <br>';
        document.getElementById('lastNameMessage').style.color = 'red';
        document.getElementById('user_last_name').style.borderColor = 'red';
        lNameValid = false;
    } else if (lastName) {
        document.getElementById('lastNameMessage').innerHTML = '';
        document.getElementById('user_last_name').style.borderColor = 'black';
        lNameValid = true;
    }
    enableSubmit();
}

// Function to validate email
function validateEmail() {
    let email = document.getElementById('user_email').value;
    if (email === "" || email === null) {
        document.getElementById('emailMessage').innerHTML = 'Email is required <br>';
        document.getElementById('emailMessage').style.color = 'red';
        document.getElementById('user_email').style.borderColor = 'red';
        emailValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
        document.getElementById('emailMessage').innerHTML = 'Please enter a valid email address <br>';
        document.getElementById('emailMessage').style.color = 'red';
        document.getElementById('user_email').style.borderColor = 'red';
        emailValid = false;
    } else if (email.includes('@') && email.includes('.')) {
        document.getElementById('emailMessage').innerHTML = '';
        document.getElementById('user_email').style.borderColor = 'black';
        emailValid = true;
    }
    enableSubmit();
}

// Function to validate username
function validateUsername() {
    let userName = document.getElementById('username').value;
    if (userName === "" || userName === null) {
        document.getElementById('userNameMessage').innerHTML = 'Username is required <br>';
        document.getElementById('userNameMessage').style.color = 'red';
        document.getElementById('username').style.borderColor = 'red';
        userNameValid = false;
    } else if (userName) {
        document.getElementById('userNameMessage').innerHTML = '';
        document.getElementById('username').style.borderColor = 'black';
        userNameValid = true;
    }
    enableSubmit();
}

// Function to validate password
function validatePassword() {
    let pw = document.getElementById('password').value;
    if (pw === "" || pw === null) {
        document.getElementById('pwMessage').innerHTML = 'Password is required <br>';
        document.getElementById('pwMessage').style.color = 'red';
        document.getElementById('password').style.borderColor = 'red';
        pwValid = false;
    } else if (pw.length < 6) {
        document.getElementById('pwMessage').innerHTML = 'Password must be at least 6 characters long';
        document.getElementById('pwMessage').style.color = 'red';
        document.getElementById('password').style.borderColor = 'red';
        pwValid = false;
    } else if (pw.length >= 6) {
        document.getElementById('pwMessage').innerHTML = '';
        document.getElementById('password').style.borderColor = 'black';
        pwValid = true;
    }
    enableSubmit();
}

// Function to validate password confirmation
function validatePasswordConfirm() {
    let pw = document.getElementById('password').value;
    let pwConfirm = document.getElementById('password_confirm').value;
    if (pw !== pwConfirm) {
        document.getElementById('pwConfirmMessage').innerHTML = 'Passwords do not match';
        document.getElementById('pwConfirmMessage').style.color = 'red';
        document.getElementById('password_confirm').style.borderColor = 'red';
        pwConfirmValid = false;
    } else if (pwConfirm === pw) {
        document.getElementById('pwConfirmMessage').innerHTML = '';
        document.getElementById('password_confirm').style.borderColor = 'black';
        pwConfirmValid = true;
    }
    enableSubmit();
}

// Test function
function test() {
    console.log("test");
    alert("test");
}
