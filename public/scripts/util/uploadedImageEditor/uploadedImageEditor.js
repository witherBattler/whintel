class UploadedImageEditor extends HTMLElement {
    constructor() {
        super()
        this.events = {
            imageInstanceAppended: [],
            removed: []
        }
    }
    connectedCallback() {
        let id = this.getAttribute("image-id")
        let imageObject
        for(let i = 0; i != uploadedImages.length; i++) {
            if(uploadedImages[i].id == id) {
                imageObject = uploadedImages[i]
                break
            }
        }
        if(imageObject == undefined) {
            throw new Error("Image with id " + id + " not found")
        }

        let shadow = this.attachShadow( { mode: "open" } )

        let style = document.createElement("link")
        style.setAttribute("rel", "stylesheet")
        style.setAttribute("href", "scripts/util/uploadedImageEditor/uploadedImageEditor.css")

        let container = document.createElement("div")
        container.setAttribute("class", "uploadedImageEditor")

        let image = document.createElement("img")
        image.src = imageObject.dataUrl
        image.setAttribute("class", "imageElement")

        let imageOverlay = document.createElement("div")
        imageOverlay.setAttribute("class", "imageOverlay")

        let idElement = document.createElement("p")
        idElement.innerText = imageObject.id
        idElement.setAttribute("class", "imageIdentifierEditor")

        let buttonsContainer = document.createElement("div")
        buttonsContainer.setAttribute("class", "buttonsContainer")

        let openInNewTab = document.createElement("img")
        openInNewTab.src = "images/icons/openIn.svg"
        openInNewTab.setAttribute("class", "openInNewTab")
        openInNewTab.addEventListener("click", () => {
            let imageWindow = window.open("")
            let image = new Image()
            image.src = imageObject.dataUrl
            imageWindow.document.write(image.outerHTML)
        })

        let copyToClipboard = document.createElement("img")
        copyToClipboard.src = "images/icons/copy.svg"
        copyToClipboard.setAttribute("class", "copyToClipboard")
        copyToClipboard.addEventListener("click", () => {
            copyText("![Caption](" + imageObject.id + ")")
        })

        let addButton = document.createElement("img")
        addButton.src = "images/icons/plus.svg"
        addButton.setAttribute("class", "addButton")
        addButton.addEventListener("click", () => {
            let newContent = editorContentElement.innerHTML + "<br>" + "![Caption](" + imageObject.id + ")"
            editorContentElement.innerHTML = newContent
            for(let i = 0; i != this.events.imageInstanceAppended.length; i++) {
                this.events.imageInstanceAppended[i](newContent)
            }
            previousEditorContent = newContent
            selectLastPositionEditor()
        })

        let xButton = document.createElement("img")
        xButton.src = "images/icons/x.svg"
        xButton.setAttribute("class", "xButton")
        xButton.addEventListener("click", () => {
            const regex = new RegExp(`!\\[.*\\]\\(${id}\\)`, "gm")
            let newContent = editorContentElement.innerText.replaceAll(regex, "")
            editorContentElement.innerText = newContent
            for(let i = 0; i != this.events.removed.length; i++) {
                this.events.removed[i](newContent)
            }
            previousEditorContent = newContent
            triggerResultRerender()
            this.remove()
            for(let i = 0; i != uploadedImages.length; i++) {
                if(uploadedImages[i].id == id) {
                    uploadedImages.splice(i, 1)
                    break
                }
            }
            if(uploadedImagesContainer.children.length == 0) {
                imageUploadingEditor.style.display = "none"
            }
        })
            

        shadow.appendChild(style)
        shadow.appendChild(container)
        container.appendChild(image)
        imageOverlay.appendChild(idElement)
        buttonsContainer.appendChild(openInNewTab)
        buttonsContainer.appendChild(copyToClipboard)
        buttonsContainer.appendChild(addButton)
        buttonsContainer.appendChild(xButton)
        imageOverlay.appendChild(buttonsContainer)
        container.appendChild(imageOverlay)
    }
    appendEvent(event, callback) {
        this.events[event].push(callback)
    }
}

customElements.define("uploaded-image-editor", UploadedImageEditor)