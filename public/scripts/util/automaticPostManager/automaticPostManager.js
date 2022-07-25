class AutomaticPostManager extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        let shadow = this.attachShadow( { mode: "open"} )

        let element = document.createElement("post-displayer")
        let id = this.getAttribute("post-id")
        let postData = JSON.parse(this.dataset.postData)


        // this user data is incomplete and only contains profile picture, username and id
        let userData = JSON.parse(this.dataset.userData)
        console.log(cachedProfileImages, userData.profilePicture)
        let profilePicture = await parseProfileImage(userData.profilePicture)

        element.setAttribute("title", postData.title)
        element.setAttribute("hearts-count", postData.heartsCount)
        element.setAttribute("comments-count", postData.commentsCount)
        element.setAttribute("poster-username", userData.username)
        
        element.setAttribute("poster-image", profilePicture)
        element.setAttribute("redirect", mainDomain + "/post/" + id)
        
        let dateDelta = Date.now() - postData.creationDate
        let convertedTime = convertTimeFromMS(dateDelta)
        element.setAttribute("date", convertedTime + " ago")

        if(loggedIn == false) {
            element.setAttribute("post-hearted", false)
        } else {
            element.setAttribute("post-hearted", postData.heartsFrom.indexOf(selfData.id) != -1)
        }
            

        shadow.appendChild(element)

        element.appendEvent("heartToggled", (event) => {
            if(loggedIn) {
                ajax("POST", "/api/post-toggle-heart/" + id)
                return true
            } else {
                setPopup(
                    `<span class="special">Login</span> to heart this post.`,
                    `On SOCAL, you need to be logged into an account to be able to heart posts. Why aren't you!?`,
                    `<a href="/login">Login</a>`,
                    `<button style="background-color: black;" onclick="hidePopup()">Later</button>`
                )
                return false
            }
        })
        element.appendEvent("profileClicked", async (event) => {
            let fullUserData = await getFullUserData(userData.id)
            setProfileCard(event.clientX, event.clientY, fullUserData.id, fullUserData.profilePicture, fullUserData.username, fullUserData.bio, fullUserData.followers, fullUserData.following)
        })
    }
}

customElements.define("automatic-post-manager", AutomaticPostManager)