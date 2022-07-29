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
            markdownChange: []
        }
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

        let orderedListButton = document.createElement("button")
        orderedListButton.classList.add("orderedListButton")
        let orderedListButtonIcon = document.createElement("img")
        orderedListButtonIcon.src = "images/icons/orderedList.svg"
        orderedListButton.appendChild(orderedListButtonIcon)

        let unorderedListButton = document.createElement("button")
        unorderedListButton.classList.add("unorderedListButton")
        let unorderedListButtonIcon = document.createElement("img")
        unorderedListButtonIcon.src = "images/icons/unorderedList.svg"
        unorderedListButton.appendChild(unorderedListButtonIcon)

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
    getRerenderedMarkdown() {
        marked.setOptions({
            smartypants: this.editorOptions.smartypants,
            smartLists: this.editorOptions.smartypants,
        })
        return marked.parse(this.value)
    }
    triggerMarkdownRerender() {
        this.events.markdownChange.forEach(callback => callback(this.getRerenderedMarkdown()))
    }
}

customElements.define('rich-text-area', RichTextArea)