let socket = io.connect(mainDomain)

let postContentElement = document.getElementById("postContent")
let postAuthor = document.getElementById("postAuthor")
let middlePost = document.getElementById("middle-post")

let root = document.querySelector(":root")

let postContentParsed

function initMarked() {
    marked.use({
        renderer: markedRenderer,
        smartypants: postIsSmartypants,
    })
    root.style.setProperty("--marked-main-font", postFont)
    postContentParsed = smartMarkedParse(content)
    postContentElement.innerHTML = postContentParsed.innerHTML
}

postAuthor.addEventListener("click", async (event) => {
    setProfileCard(event.clientX, event.clientY, authorData.id, authorData.profilePicture, authorData.bannerImage, authorData.username, authorData.bio, authorData.followers, authorData.following, function() {
        middlePost.style.display = "none"
    }, function() {
        middlePost.style.display = "block"
    })
})