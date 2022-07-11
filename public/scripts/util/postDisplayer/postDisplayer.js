/* CustomElement version of this:*/
/* <div class="row post defaultRowRadius">
    <post-rating></post-rating>
    <div class="postRight">
        <div class="postTop">
            <p class="postTitle">Unable to draw an arc in an HTML Canvas? You can try this cool tip! Wait, maybe it won't work. Let's see!</p>
        </div>
        <div class="postBottom">
            <whintel-hashtag>HTML</whintel-hashtag>
            <div class="postProfileContainer">
                <img src="/images/icons/defaultProfileBlack.svg" class="postProfileImage">
                <p class="postProfileUsername">asdf</p>
            </div>
        </div>
    </div>
</div> */

const PROFILE_IMAGE_WIDTH_HEIGHT_RATIO = "68 / 82"

class postDisplayer extends HTMLElement {
    constructor() {
        super()
        this.events = {
            heartAdded: [],
            heartRemoved: [],
            heartToggled: [],
            profileClicked: [],
        }
    }
    connectedCallback() {
        let shadow = this.attachShadow( { mode: "open" } )

        let style = document.createElement("link")
        style.setAttribute("rel", "stylesheet")
        style.setAttribute("href", "scripts/util/postDisplayer/postDisplayer.css")

        let container = document.createElement("div")
        container.setAttribute("class", "container")

        let thumbnail = this.getAttribute("thumbnail")
        let thumbnailElement
        if(thumbnail != null) {
            thumbnailElement = document.createElement("div")
            thumbnailElement.setAttribute("class", "thumbnail")
            thumbnailElement.src = thumbnail
        }

        let title = document.createElement("a")
        title.setAttribute("class", "title")
        title.innerHTML = this.getAttribute("title")
        title.href = this.getAttribute("redirect")

        let bottom = document.createElement("div")
        bottom.setAttribute("class", "bottom")

        let profileContainer = document.createElement("div")
        profileContainer.setAttribute("class", "profileContainer")
        profileContainer.addEventListener("click", (event) => {
            for(let i = 0; i != this.events.profileClicked.length; i++) {
                this.events.profileClicked[i](event)
            }
        })

        let profileImage = document.createElement("img")
        profileImage.setAttribute("class", "profileImage")
        let src = this.getAttribute("poster-image")
        if(src == "default") {
            src = "images/icons/defaultProfile.svg"
            profileImage.style.aspectRatio = PROFILE_IMAGE_WIDTH_HEIGHT_RATIO
        }
        profileImage.src = src

        let profileUsername = document.createElement("p")
        profileUsername.setAttribute("class", "profileUsername")
        profileUsername.innerHTML = this.getAttribute("poster-username")

        let date = document.createElement("p")
        date.setAttribute("class", "date")
        date.innerHTML = this.getAttribute("date") || "Unknown"

        let statsOuterContainer = document.createElement("div")
        statsOuterContainer.setAttribute("class", "statsOuterContainer")

        let statsContainer = document.createElement("div")
        statsContainer.setAttribute("class", "statsContainer")

        let heartsContainer = document.createElement("div")
        heartsContainer.setAttribute("class", "heartsContainer")

        let heartImage = document.createElement("img")
        heartImage.setAttribute("class", "heartImage")
        heartImage.src = this.getAttribute("post-hearted") == "true" ? "images/icons/heart.svg" : "images/icons/heart-blurred.svg"
        heartImage.addEventListener("click", (event) => {
            this.currentlyHearted = !this.currentlyHearted
            for(let i = 0; i != this.events.heartToggled.length; i++) {
                this.events.heartToggled[i](this.currentlyHearted)
            }
            if(this.currentlyHearted) {
                heartImage.src = "images/icons/heart.svg"
                heartCount.style.color = "#ff5775"
                heartCount.innerHTML = parseInt(heartCount.innerHTML) + 1
                for(let i = 0; i != this.events.heartAdded.length; i++) {
                    this.events.heartAdded[i]()
                }
            } else {
                heartImage.src = "images/icons/heart-blurred.svg"
                heartCount.style.color = "#d1d1d1"
                heartCount.innerHTML = parseInt(heartCount.innerHTML) - 1
                for(let i = 0; i != this.events.heartRemoved.length; i++) {
                    this.events.heartRemoved[i]()
                }
            }
        })

        let heartCount = document.createElement("p")
        heartCount.setAttribute("class", "heartCount")
        heartCount.innerHTML = this.getAttribute("hearts-count")
        heartCount.style.color = this.getAttribute("post-hearted") == "true" ? "#ff5775" : "#d1d1d1"

        let commentsContainer = document.createElement("div")
        commentsContainer.setAttribute("class", "commentsContainer")

        let commentsImage = document.createElement("img")
        commentsImage.setAttribute("class", "commentsImage")
        commentsImage.src = "images/icons/messages.svg"

        let commentsCount = document.createElement("p")
        commentsCount.setAttribute("class", "commentsCount")
        commentsCount.innerHTML = this.getAttribute("comments-count")

        let hr = document.createElement("hr")
        hr.setAttribute("class", "hr")

        

        statsOuterContainer.appendChild(statsContainer)
        statsContainer.appendChild(heartsContainer)
        statsContainer.appendChild(commentsContainer)
        heartsContainer.appendChild(heartImage)
        heartsContainer.appendChild(heartCount)
        commentsContainer.appendChild(commentsImage)
        commentsContainer.appendChild(commentsCount)
        if(thumbnail != null) {
            container.appendChild(thumbnailElement)
        }
        container.appendChild(title)
        bottom.appendChild(profileContainer)
        bottom.appendChild(date)
        bottom.appendChild(statsOuterContainer)
        profileContainer.appendChild(profileImage)
        profileContainer.appendChild(profileUsername)
        container.appendChild(bottom)
        container.appendChild(hr)
        shadow.appendChild(style)
        shadow.appendChild(container)
    }
    setHeartCount(count) {
        heartCount.innerHTML = count
        this.setAttribute("hearts-count", count)
    }
    appendEvent(eventName, callback) {
        this.events[eventName].push(callback)
    }
    get currentlyHearted() {
        return this.getAttribute("post-hearted") == "true"
    }
    set currentlyHearted(value) {
        this.setAttribute("post-hearted", value)
    }
}

customElements.define("post-displayer", postDisplayer)