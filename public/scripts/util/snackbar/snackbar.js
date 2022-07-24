let snackbar = document.getElementById("snackbar")

let previousTimeout = null

function showSnackbar(message) {
    snackbar.textContent = message
    snackbar.style.top = "30px"
    
    if(previousTimeout != null) {
        clearTimeout(previousTimeout)
    }
    previousTimeout = setTimeout(() => {
        snackbar.style.top = "-100px"
    }, 3000)
}