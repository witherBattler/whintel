const socket = io()
socket.on("connect", () => {
    socket.emit("subscribe", {
        type: "feed-update",
    })
})
socket.on("new-post", async (data) => {
    // Don't refresh feed because then all posts have to regenerate
    let newFeedElement = document.createElement("automatic-post-manager")
    newFeedElement.setAttribute("post-id", data.id)
    newFeedElement.dataset.postData = JSON.stringify(data)
    let user = await ajax("GET", "/api/user/" + data.user)
    console.log(user)
    newFeedElement.dataset.userData = user
    postsContainer.prepend(newFeedElement)
})


let feedCategoriesElements = document.getElementById("feedCategories").children
let feedCategoryRecent = document.getElementById("feedCategoryRecent")
let feedCategoryFollowing = document.getElementById("feedCategoryFollowing")
let postsContainer = document.getElementById("postsContainer")
let currentFeedCategory = "recent"
for(let i = 0; i != feedCategoriesElements.length; i++) {
    feedCategoriesElements[i].addEventListener("click", () => {
        currentFeedCategory = feedCategoriesElements[i].innerText.toLowerCase()
        switch(currentFeedCategory) {
            case "recent":
                feedCategoryRecent.classList.add("selected")
                feedCategoryFollowing.classList.remove("selected")
                break
            case "following":
                feedCategoryRecent.classList.remove("selected")
                feedCategoryFollowing.classList.add("selected")
                break
        }
        triggerFeedRerender(currentFeedCategory)
    })
}

async function triggerFeedRerender(type, skip = 0, callback = function() {}) {
    let result
    switch(type) {
        case "recent":
            result = await ajax("GET", "/api/feed/recent?skip=" + skip)
            result = JSON.parse(result)
            break
        case "following":
            result = await ajax("GET", "/api/feed/following?skip=" + skip)
            result = JSON.parse(result)
            break
    }
    let userData = []
    for(let i = 0; i != result.length; i++) {
        let user = await ajax("GET", "/api/get-basic-user-data/" + result[i].user)
        user = JSON.parse(user)
        userData.push(user)
        let isHearted = await ajax("GET", "/api/post-is-liked/" + result[i].id)
        result[i].hearted = isHearted
    }
    postsContainer.innerText = ""
    postsContainer.style.display = "none"
    for(let i = 0; i != result.length; i++) {
        let element = document.createElement("automatic-post-manager")
        element.setAttribute("post-id", result[i].id)
        element.dataset.postData = JSON.stringify(result[i])
        element.dataset.userData = JSON.stringify(userData[i])
        postsContainer.appendChild(element)
    }
    postsContainer.style.display = "block"

    callback()
}

async function appendToFeed(type, skip = 0, callback = function() {}) {
    let result
    switch(type) {
        case "recent":
            result = await ajax("GET", "/api/feed/recent?skip=" + skip)
            result = JSON.parse(result)
            break
        case "following":
            result = await ajax("GET", "/api/feed/following?skip=" + skip)
            result = JSON.parse(result)
            break
    }
    let userData = []
    for(let i = 0; i != result.length; i++) {
        if(loggedIn) {
            let user = await ajax("GET", "/api/user/" + result[i].user)
            user = JSON.parse(user)
            userData.push(user)
            let isHearted = await ajax("GET", "/api/post-is-liked/" + result[i].id)
            result[i].hearted = isHearted
        } else {
            result[i].hearted = false
        }
    }
    for(let i = 0; i != result.length; i++) {
        let element = document.createElement("automatic-post-manager")
        element.setAttribute("post-id", result[i].id)
        element.dataset.postData = JSON.stringify(result[i])
        element.dataset.userData = JSON.stringify(userData[i])
        postsContainer.appendChild(element)
    }
    callback()
}

let middle = document.getElementById("middle")
let overscrollAmount = 0
let canOverscroll = true
middle.addEventListener("scroll", (event) => {
    if(canOverscroll && middle.scrollHeight - middle.scrollTop == middle.clientHeight) {
        canOverscroll = false
        overscrollAmount++
        appendToFeed(currentFeedCategory, overscrollAmount * 14, function() {
            setTimeout(() => {
                canOverscroll = true
            }, 50)
        })
    }
})




// getSelfData().then(data => {
//     let profilePicture = data.profilePicture
//     if(profilePicture == "default") {
//         profilePicture = "/images/defaultProfile.svg"
//     } else {
//         profilePicture = getBase64Prefix(profilePicture) + profilePicture
//     }
//     let username = data.username
//     let level = data.level

//     profileImageElement.src = profilePicture
//     profileUsernameLabelElement.innerText = username
//     profileLevelLabelElement.innerText = "Level: " + level
// })
    

triggerFeedRerender(currentFeedCategory)