const form = document.querySelector('form');
const emailInput = document.querySelector('input[name="email"]');
const phoneInput = document.querySelector('input[name="phone"]');
const submitButton = document.querySelector('button[type="submit"]');

let userEmailFromCookie = getCookie('userEmail');
let userPhoneFromCookie = getCookie('userPhone');

if (userEmailFromCookie && userPhoneFromCookie) {
emailInput.value = userEmailFromCookie;
phoneInput.value = userPhoneFromCookie;
submitButton.disabled = true;
}

emailInput.addEventListener('input', function() {
const enteredEmail = emailInput.value;
if (enteredEmail === userEmailFromCookie) {
alert('This email has already been registered!');
submitButton.disabled = true;
} else {
submitButton.disabled = false;
}
});

// Проверка при вводе phone
phoneInput.addEventListener('input', function() {
const enteredPhone = phoneInput.value;
if (enteredPhone === userPhoneFromCookie) {
alert('This phone number has already been used!');
submitButton.disabled = true;
} else {
submitButton.disabled = false;
}
});


submitButton.addEventListener('click', function(event) {
event.preventDefault();

const enteredEmail = emailInput.value;
const enteredPhone = phoneInput.value;

if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(enteredEmail) &&
/^\d+$/.test(enteredPhone)) {
setCookie('userEmail', enteredEmail);
setCookie('userPhone', enteredPhone);

form.submit();
} else {
if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(enteredEmail)) {
alert('Enter a valid e-mail address!');
}
if (!/^\d+$/.test(enteredPhone)) {
alert('Enter a valid phone number!');
}
}
});

function getCookie(name) {
const value = `; ${document.cookie}`;
const parts = value.split('; ' + name + '=');
if (parts.length === 2) {
return parts.pop().replace(/%3D/g, '=');
}
}

function setCookie(name, value, expires = 1) {
const expDate = new Date();
expDate.setDate(expDate.getDate() + expires);
document.cookie = `${name}=${value}; expires=${expDate.toUTCString()}; path=/`;
}