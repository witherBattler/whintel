

let postContentElement = document.getElementById("postContent")

let root = document.querySelector(":root")

let postContentParsed

function initMarked() {
    marked.use({
        renderer: markedRenderer,
        smartypants: postIsSmartypants,
    })
    root.style.setProperty("--marked-main-font", postFont)
    postContentParsed = marked.parse(content)
    postContentElement.innerHTML = postContentParsed
}