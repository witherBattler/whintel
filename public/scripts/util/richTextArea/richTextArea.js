class RichTextArea extends HTMLElement {
    constructor() {
        super()
        this.editorOptions = {
            font: "Euclid",
            smartypants: true,
        }
        this.events = {
            input: [],
            fontChange: [],
            caseChange: [],
            markdownChange: [],
        }
        this.images = []
    }
    connectedCallback() {
        let shadow = this.attachShadow({mode: "open"})
        let style = document.createElement("link")
        style.rel = "stylesheet"
        style.href = "scripts/util/richTextArea/richTextArea.css"

        let container = document.createElement("div")
        container.classList.add("container")
        
        let toolbar = document.createElement("div")
        toolbar.classList.add("toolbar")

        let section1 = document.createElement("div")
        section1.classList.add("section")

        let fontSelector = document.createElement("smart-dropdown")
        fontSelector.classList.add("font-selector")
        fontSelector.setAttribute("options", "Euclid,Helvetica,Red Hat,Times,Consolas,Georgia,Tahoma,Verdana,Garamond")
        fontSelector.setAttribute("special", "font")
        fontSelector.setAttribute("width", "180px")
        fontSelector.setAttribute("border-radius", "left")
        fontSelector.appendEvent("change", (value) => {
            this.editorOptions.font = value
            fontSelector.font = value
            this.events.fontChange.forEach(callback => callback(value))
        })

        let caseSwitchButton = document.createElement("button")
        caseSwitchButton.classList.add("caseSwitchButton")
        let caseSwitchButtonIcon = document.createElement("img")
        caseSwitchButtonIcon.src = "images/icons/smartypantsCase.svg"
        caseSwitchButton.appendChild(caseSwitchButtonIcon)
        caseSwitchButton.addEventListener("click", () => {
            this.editorOptions.smartypants = !this.editorOptions.smartypants
            caseSwitchButtonIcon.src = this.editorOptions.smartypants ? "images/icons/smartypantsCase.svg" : "images/icons/normalCase.svg"
            this.events.caseChange.forEach(callback => callback(this.editorOptions.smartypants))
            this.triggerMarkdownRerender()
        })

        section1.appendChild(fontSelector)
        section1.appendChild(caseSwitchButton)
        toolbar.appendChild(section1)
        container.appendChild(toolbar)
        shadow.appendChild(container)
        shadow.appendChild(style)

        let headingButtons = []
        let headingButtonsSection = document.createElement("div")
        headingButtonsSection.classList.add("section")

        for(let i = 0; i != 6; i++) {
            let heading = i + 1
            let headingButton = document.createElement("button")
            headingButton.classList.add("headingButton")
            if(i == 0) {
                headingButton.classList.add("first")
            }
            if(i == 5) {
                headingButton.classList.add("last")
            }
            let headingButtonIcon = document.createElement("img")
            headingButtonIcon.src = `images/icons/headings/heading${heading}.svg`
            headingButton.appendChild(headingButtonIcon)
            headingButtons.push(headingButton)
            headingButtonsSection.appendChild(headingButton)

            let hashes = repeatString("#", heading)

            headingButton.addEventListener("click", () => {
                let value = this.value
                let newValue
                if(value == "") {
                    newValue = this.value + `${hashes} `
                } else {
                    newValue = this.value + `\n${hashes} `
                }
                this.value = newValue
                this.textArea.focus()
            })
        }
        toolbar.appendChild(headingButtonsSection)
        
        let section3 = document.createElement("div")
        section3.classList.add("section")
        section3.classList.add("section3")

        let imageButton = document.createElement("button")
        imageButton.classList.add("imageButton")
        let imageButtonIcon = document.createElement("img")
        imageButtonIcon.src = "images/icons/pickImage2.svg"
        imageButton.appendChild(imageButtonIcon)

        let imageOptions = document.createElement("div")
        imageOptions.classList.add('imageOptions')
        imageButton.addEventListener("click", (event) => {
            imageOptions.style.display = "flex"
            imageOptions.style.top = event.clientY + "px"
            imageOptions.style.left = event.clientX + "px"
        })
        window.addEventListener("click", (event) => {
            if(!imageButton.matches(":hover") && !imageOptions.matches(":hover")) {
                imageOptions.style.display = "none"
                if(this.images.length == 0) {
                    imageOptionsAddImage.style.borderBottom = null
                    return
                }
                imageOptionsAddImage.style.borderBottom = "1px solid #d1d1d1"
            }
        })
        let imageOptionsAddImage = document.createElement("button")
        imageOptionsAddImage.classList.add("imageOptionsAddImage")
        imageOptions.appendChild(imageOptionsAddImage)

        let imageOptionsAddImageInput = document.createElement("input")
        imageOptionsAddImageInput.id = "imageOptionsAddImageInput"
        imageOptionsAddImageInput.type = "file"
        imageOptionsAddImageInput.accept = "image/*"
        imageOptionsAddImage.appendChild(imageOptionsAddImageInput)

        let imageOptionsAddImageLabel = document.createElement("label")
        imageOptionsAddImageLabel.for = "imageOptionsAddImageInput"
        imageOptionsAddImage.appendChild(imageOptionsAddImageLabel)

        let imageOptionsAddImageIcon = document.createElement("img")
        imageOptionsAddImageIcon.src = "images/icons/plusLeft.svg"
        imageOptionsAddImageLabel.appendChild(imageOptionsAddImageIcon)

        let imageOptionsAddImageText = document.createElement("p")
        imageOptionsAddImageText.innerText = "Add Image"
        imageOptionsAddImageLabel.appendChild(imageOptionsAddImageText)

        let imagesList = document.createElement("div")
        imagesList.classList.add("imagesList")
        imageOptions.appendChild(imagesList)

        let orderedListButton = document.createElement("button")
        orderedListButton.classList.add("orderedListButton")
        let orderedListButtonIcon = document.createElement("img")
        orderedListButtonIcon.src = "images/icons/orderedList.svg"
        orderedListButton.appendChild(orderedListButtonIcon)
        orderedListButton.addEventListener("click", () => {
            let value = this.value
            let newValue
            if(value == "") {
                newValue = this.value + `1. `
            } else {
                newValue = this.value + `\n1. `
            }
            this.value = newValue
            this.textArea.focus()
        })


        let unorderedListButton = document.createElement("button")
        unorderedListButton.classList.add("unorderedListButton")
        let unorderedListButtonIcon = document.createElement("img")
        unorderedListButtonIcon.src = "images/icons/unorderedList.svg"
        unorderedListButton.appendChild(unorderedListButtonIcon)
        unorderedListButton.addEventListener("click", () => {
            let value = this.value
            let newValue
            if(value == "") {
                newValue = this.value + `* `
            } else {
                newValue = this.value + `\n* `
            }
            this.value = newValue
            this.textArea.focus()
        })

        section3.appendChild(imageButton)
        section3.appendChild(orderedListButton)
        section3.appendChild(unorderedListButton)
        toolbar.appendChild(section3)
        

        let textArea = document.createElement("textarea")
        textArea.classList.add("textArea")
        container.appendChild(textArea)
        textArea.setAttribute("placeholder", "Enter the content of your post here...")
        textArea.setAttribute("spellcheck", "false")
        textArea.addEventListener("input", (event) => {
            this.events.input.forEach(callback => callback(event.target.value))
            this.triggerMarkdownRerender()
        })
        this.textArea = textArea

        container.appendChild(imageOptions)
    }
    get value() {
        return this.textArea.value
    }
    set value(value) {
        this.textArea.value = value
    }
    onInput(callback) {
        this.events.input.push(callback)
    }
    onFontChange(callback) {
        this.events.fontChange.push(callback)
    }
    onCaseChange(callback) {
        this.events.caseChange.push(callback)
    }
    onMarkdownChange(callback) {
        this.events.markdownChange.push(callback)
    }
    getMarked() {
        marked.setOptions({
            smartypants: this.editorOptions.smartypants,
            smartLists: this.editorOptions.smartypants,
        })
        return marked.parse(this.value)
    }
    triggerMarkdownRerender() {
        this.events.markdownChange.forEach(callback => callback(this.getMarked()))
    }
}

customElements.define('rich-text-area', RichTextArea)