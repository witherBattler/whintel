let editorOptions = {
    font: "Euclid",
    smartypants: true,
}

let editorContentElement = document.getElementById("editorContent")
let markupResultElement = document.getElementById("markupResult")
let previousEditorContent = editorContentElement.getMarked()

marked.setOptions({
    breaks: true,
    gfm: true,
    smartypants: true,
})

let root = document.querySelector(":root")
editorContentElement.onMarkdownChange(text => {
    if(previousEditorContent != text) {
        markupResultElement.innerHTML = text
        previousEditorContent = text
    }
})
editorContentElement.onFontChange(font => {
    root.style.setProperty("--marked-main-font", font)
})

marked.use({
    renderer: markedRenderer
})


/* // Toolbar

let fontPickerEditor = document.getElementById("fontPickerEditor")
console.log(fontPickerEditor)
fontPickerEditor.appendEvent("change", (value) => {
    fontPickerEditor.dropdownLabel.style.fontFamily = value
    editorOptions.font = value
    root.style.setProperty("--marked-main-font", value)
})

let headingButtonsEditor = Array.from(document.getElementsByClassName("headingButtonEditor"))
for(let i = 0; i != headingButtonsEditor.length; i++) {
    let hashes = ""
    for(let j = 0; j != i + 1; j++) {
        hashes += "#"
    }

    headingButtonsEditor[i].addEventListener("click", () => {
        let newContent = editorContentElement.innerHTML + "<br><br>" + hashes + "&nbsp;"
        editorContentElement.innerHTML = newContent
        editorContentElement.focus()
        let range = document.createRange()
        let selection = window.getSelection()
        selection.collapse(editorContentElement.lastChild, editorContentElement.lastChild.length)
        selection.addRange(range)
        previousEditorContent = newContent
        triggerResultRerender()
    })
}

let selectLastPositionEditor = editorContentElement.selectLastPosition.bind(editorContentElement)

function triggerResultRerender() {
    let content = editorContentElement.innerText
    let markupResult = marked.parse(content)
    markupResultElement.innerHTML = markupResult
}
triggerResultRerender() */
// Image Upload
/* 
let uploadedImages = []
let imageUploader = document.getElementById("imageButtonEditor")
let imageUploadingEditor = document.getElementById("imageUploadingEditor")
let uploadedImagesContainer = document.getElementById("uploadedImagesContainerEditor")
imageUploader.addEventListener("change", (event) => {
    let files = event.target.files
    for(let i = 0; i != files.length; i++) {
        let file = files[i]
        let reader = new FileReader()
        let idInt = uploadedImages.length + 1
        let id = "image-"
        while(imagesHaveId(id + idInt)) {
            idInt++
        }
        let fullId = id + idInt
        let image = {
            id: fullId,
            dataUrl: null,
        }

        reader.onload = (event2) => {
            image.dataUrl = event2.target.result
            uploadedImages.push(image)
            const text = `<br>![Caption](${fullId})`
            let newContent = editorContentElement.innerHTML + text
            editorContentElement.innerHTML = newContent
            triggerResultRerender()

            imageUploadingEditor.style.display = "block"
            let uploadedImageElement = document.createElement("uploaded-image-editor")
            uploadedImageElement.setAttribute("image-id", fullId)
            uploadedImageElement.appendEvent("imageInstanceAppended", (event) => {
                triggerResultRerender()
            })
            uploadedImagesContainer.appendChild(uploadedImageElement)
        }
        reader.readAsDataURL(file)
    }
})

function imagesHaveId(id) {
    for(let i = 0; i != uploadedImages.length; i++) {
        if(uploadedImages[i].id == id) {
            return true
        }
    }
    return false
} */
// confirm post
let confirmPostButton = document.getElementById("confirmPost")
confirmPostButton.addEventListener("click", async (event) => {
    let toSend = {
        content: editorContentElement.innerText,
        options: editorOptions,
        images: uploadedImages,
        title: editorTitle.value,
    }
    let result = await ajax("POST", "api/create-post", toSend)
    if(result != false) {
        window.location = result
    } else {
        alert("Error creating post")
    }
})