let loginButton = document.getElementById('confirmButton');
let registerButton = document.getElementById('registerButton');
let usernameInput = document.getElementById('usernameInput');
let passwordInput = document.getElementById('passwordInput');

loginButton.addEventListener('click', () => {
    let username = usernameInput.value
    let password = passwordInput.value
    login(username, password)
})



async function login(username, password) {
    let result = await post(mainDomain + "/api/login", {
        username: username,
        password: password
    })
    if(result != "false") {
        document.cookie = "username=" + username
        document.cookie = "session=" + result
        window.location = mainDomain + "/home"
    } else {
        alert("wrong username or password");
    }
}


