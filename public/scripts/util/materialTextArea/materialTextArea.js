class MaterialTextArea extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        let shadow = this.attachShadow({mode: "open"})

        let style = document.createElement("link")
        style.rel = "stylesheet"
        style.href = "scripts/util/materialTextArea/materialTextArea.css"

        let container = document.createElement("div")
        container.classList.add("container")
        this.container = container

        let input = document.createElement("textarea")
        input.classList.add("input")
        input.style.height = "100px"
        input.addEventListener("focus", (event) => {
            container.classList.add("focus")
            container.classList.remove("positioned-blur")
        })
        input.addEventListener("blur", (event) => {
            container.classList.remove("focus")
            if(input.value != "") {
                container.classList.add("positioned-blur")
            }
        })
        input.addEventListener("input", (event) => {
            if(maxLength) {
                characterCounter.innerText = input.value.length + "/" + maxLength
            }
            if(this.getAttribute("allow-spaces") == "false") {
                let withoutSpaces = input.value.replace(/\s/g, "")
                if(withoutSpaces.length != input.value.length) {
                    input.value = withoutSpaces
                }
            }
            if(maxLength) {
                input.value = input.value.substring(0, maxLength)
                characterCounter.innerText = input.value.length + "/" + maxLength
            }
        })
        this.input = input

        let label = document.createElement("p")
        label.classList.add("label")
        label.innerText = this.getAttribute("placeholder")

        let border = document.createElement("div")
        border.classList.add("border")

        let maxLength = this.getAttribute("max-length")
        let characterCounter
        if(maxLength) {
            characterCounter = document.createElement("p")
            characterCounter.classList.add("character-counter")
            characterCounter.innerText = "0/" + maxLength
            this.characterCounter = characterCounter
        }

        shadow.appendChild(container)
        shadow.appendChild(style)
        container.appendChild(input)
        container.appendChild(label)
        container.appendChild(border)
        if(maxLength) {
            container.appendChild(characterCounter)
        }
    }
    get value() {
        return this.input.value
    }
    set value(value) {
        this.input.value = value
        let maxLength = this.getAttribute("max-length")
        if(maxLength) {
            this.characterCounter.innerText = value.length + "/" + maxLength
        }
        if(this.input.value != 0) {
            this.container.classList.add("positioned-blur")
        }
    }
    onInput(callback) {
        this.input.addEventListener("input", function() {
            callback(this.value)
        })
    }
}

customElements.define('material-text-area', MaterialTextArea);