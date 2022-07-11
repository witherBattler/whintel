let loginButton = document.getElementById('buttonLogin');
let registerButton = document.getElementById('buttonRegister');
let usernameInput = document.getElementById('usernameInput');
let passwordInput = document.getElementById('passwordInput');

loginButton.addEventListener("click", (event) => {
    window.location = mainDomain + "/login"
})

registerButton.addEventListener("click", (event) => {
    let username = usernameInput.value
    let password = passwordInput.value
    register(username, password)
})

async function register(username, password) {
    let result = await post(mainDomain + "/api/register/", {
        username: usernameInput.value,
        password: passwordInput.value
    })
    if(result != false) {
        document.cookie = "username=" + usernameInput.value
        document.cookie = "session=" + result
        window.location = mainDomain + "/home"
    } else {
        alert("Username is taken")
    }
}