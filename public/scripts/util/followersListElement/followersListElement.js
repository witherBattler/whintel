class FollowersListElement extends HTMLElement {
    constructor() {
        super()
        this.events = {
            followerAdded: [],
            followerRemoved: [],
            followerToggled: [],
            profileClicked: [],
        }
    }
    connectedCallback() {
        let id = this.getAttribute("id")


        let shadow = this.attachShadow( { mode: "open" } )

        let style = document.createElement("link")
        style.setAttribute("rel", "stylesheet")
        style.setAttribute("href", "scripts/util/followersListElement/followersListElement.css")

        let container = document.createElement("button")
        container.setAttribute("class", "container")

        let profilePicture = document.createElement("img")
        profilePicture.setAttribute("class", "profilePicture")
        let src = this.getAttribute("profile-picture")
        parseProfileImage(src).then((image) => {
            profilePicture.src = image
        })

        let right = document.createElement("div")
        right.setAttribute("class", "right")

        let top = document.createElement("div")
        top.setAttribute("class", "top")

        let username = document.createElement("p")
        username.setAttribute("class", "username")
        username.innerHTML = this.getAttribute("username")

        let followButton = document.createElement("button")
        followButton.setAttribute("class", "followButton")
        followButton.addEventListener("click", async (event) => {
            if(loggedIn) {
                if(this.isFollowed) {
                    this.changeIsFollowed(false)
                    await ajax("POST", "/api/unfollow/" + id)                    
                } else {
                    this.changeIsFollowed(true)
                    await ajax("POST", "/api/follow/" + id)
                }
            } else {
                setPopup(
                    `<span class="special">Login</span> to follow this user.`,
                    `On SOCAL, you need to be logged into an account to be able to follow other people. Why aren't you!?`,
                    `<a href="/login">Login</a>`,
                    `<button style="background-color: black;" onclick="hidePopup()">Later</button>`
                )
            }
        })
        this.followButton = followButton

        let followButtonIcon = document.createElement("img")
        followButtonIcon.src = "images/icons/plusFollow.svg"
        followButtonIcon.classList.add("followButtonIcon")
        this.followButtonIcon = followButtonIcon

        let followButtonText = document.createElement("p")
        followButtonText.innerHTML = "Follow"
        followButtonText.classList.add("followButtonText")
        this.followButtonText = followButtonText

        if(loggedIn) {
            this.changeIsFollowed(selfData.following.indexOf(id) != -1)
        } else {
            this.changeIsFollowed(false)
        }

        let bottom = document.createElement("div")
        bottom.setAttribute("class", "bottom")

        let bio = document.createElement("p")
        bio.setAttribute("class", "bio")
        bio.innerText = this.getAttribute("bio")

        let hr = document.createElement("hr")

        shadow.appendChild(style)
        shadow.appendChild(container)
        container.appendChild(profilePicture)
        container.appendChild(right)
        right.appendChild(top)
        top.appendChild(username)
        top.appendChild(followButton)
        followButton.appendChild(followButtonIcon)
        followButton.appendChild(followButtonText)
        right.appendChild(bottom)
        bottom.appendChild(bio)
        shadow.appendChild(hr)
    }
    changeIsFollowed(isFollowed) {
        this.isFollowed = isFollowed
        switch(this.isFollowed) {
            case true:
                this.followButton.style.backgroundColor = "#FF5775"
                this.followButtonText = "Unfollow"
                this.followButtonIcon.src = "images/icons/checkmark.svg"
                break;
            case false:
                this.followButton.style.backgroundColor = "var(--theme-color)"
                this.followButtonText = "Follow"
                this.followButtonIcon.src = "images/icons/plusFollow.svg"
                break;
        }
    }
}

customElements.define("followers-list-element", FollowersListElement)



// Who are you talking to right now?
// Who is it you think you see?
// Do you know, how much I make a year?
// Well, even if I told you, you wouldn't believe it.
// Do you know what would happen if I stopped going into work?
// A business, big enough that it could be listed on the NASDAQ goes belly up.
// Disappears.
// It ceases to exist without me.
// No, you clearly don't know who you're talking to.
// So let me clue you in.
// I am not in danger skyler.
// I am the danger.
// A guy opens his door and gets shot and you think and you think that of me?
// I am the one who knocks.