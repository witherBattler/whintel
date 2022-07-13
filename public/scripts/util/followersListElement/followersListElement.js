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
        followButton.innerHTML = "Follow"
        followButton.addEventListener("click", (event) => {
            for(let i = 0; i != this.events.followerAdded.length; i++) {
                this.events.followerAdded[i](event)
            }
        })

        let bottom = document.createElement("div")
        bottom.setAttribute("class", "bottom")

        let bio = document.createElement("p")
        bio.setAttribute("class", "bio")
        bio.innerText = this.getAttribute("bio")

        shadow.appendChild(style)
        shadow.appendChild(container)
        container.appendChild(profilePicture)
        container.appendChild(right)
        right.appendChild(top)
        top.appendChild(username)
        right.appendChild(followButton)
        right.appendChild(bottom)
        bottom.appendChild(bio)
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