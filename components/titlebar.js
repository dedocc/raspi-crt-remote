class Titlebar extends HTMLElement {
    static get observedAttributes() {
        return ['icon', 'title'];
    }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                bar {
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    font-weight: bold;
                    height: 25px;
                    width: 100%;
        justify-content: space-between;
                    background: linear-gradient(-45deg, #00FFE1, #FF2583);
                    padding: 2px 5px;
                }

                .title {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #fff;
                }

                .title img {
                    width: 18px;
                }

                button {
                    font: inherit;
                    font-size: 12px;
                    border-color: white black black white;
                    background-color: #c0c0c0;
                    height: 100%;
                    width: 21px;
                    padding: 0px;
                }
            </style>
            
            <bar>
    <div class="title">
                    <img id="tb-icon" src="" alt="titlebar icon">
                    <p id="title">Window Title</p>
                </div>
                    <button>✕</button>
            </bar>
        `;
        
        this.imageElement = this.shadowRoot.getElementById('tb-icon');
        this.captionElement = this.shadowRoot.getElementById('title');
    }

    connectedCallback() {
        // Initialize values when component is added to DOM
        this.updateImage();
        this.updateCaption();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'icon') {
            this.updateImage();
        } else if (name === 'title') {
            this.updateCaption();
        }
    }

    updateImage() {
        const src = this.getAttribute('icon') || '';
        this.imageElement.src = src;
    }

    updateCaption() {
        const caption = this.getAttribute('title') || '';
        this.captionElement.textContent = caption;
    }
}

customElements.define("my-titlebar", Titlebar);
