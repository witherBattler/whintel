class AutomaticPostManager extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        let shadow = this.attachShadow( { mode: "open"} )

        let element = document.createElement("post-displayer")
        let id = this.getAttribute("post-id")
        let postData = JSON.parse(this.dataset.postData)
        let userData = JSON.parse(this.dataset.userData)

        element.setAttribute("title", postData.title)
        element.setAttribute("hearts-count", postData.heartsCount)
        element.setAttribute("comments-count", postData.commentsCount)
        element.setAttribute("poster-username", userData.username)
        element.setAttribute("poster-image", userData.profilePicture)
        element.setAttribute("redirect", mainDomain + "/post/" + id)
        
        let dateDelta = Date.now() - postData.creationDate
        console.log(dateDelta)
        let convertedTime = convertTimeFromMS(dateDelta)
        element.setAttribute("date", convertedTime + " ago")

        element.setAttribute("post-hearted", postData.hearted)

        shadow.appendChild(element)

        element.appendEvent("heartToggled", (event) => {
            ajax("POST", "/api/post-toggle-heart/" + id)
        })
        element.appendEvent("profileClicked", (event) => {
            setProfileCard(event.clientX, event.clientY, userData.id, userData.profilePicture, userData.username, userData.bio, userData.followers, userData.following)
        })
    }
}

customElements.define("automatic-post-manager", AutomaticPostManager)