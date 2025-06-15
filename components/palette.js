class Palette extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                .palette {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 5px;
                    padding: 5px;
                }
                .swatch-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 20px);
                    gap: 3px;
                    width: fit-content;
                    padding: 5px;
                    margin: 5px;
                }
                .swatch {
                    width: 100%;
                    aspect-ratio: 1/1;
                    box-shadow: 1px 1px 0px 0px #FFFFFF, 1px 1px 0px 0px #000 inset;
                }

                .currentcolors {
                    width: fit-content;
                    padding: 8px 10px;
                    position: relative;
                    display: inline-block;
                    background: repeating-conic-gradient(#bfbfbf 0 25%, #ffffff 0 50%) 50% / 2px 2px;
                    box-shadow: 1px 1px 0px 0px #555 inset, 1px 1px 0px 0px #fff;
                }

                .sw1, .sw2 {
                    position: relative;
                    width: 20px;
                    height: 20px;
                    border: 2px ridge #fff;
                }

                .sw1 {
                    z-index: 2;
                }

                .sw2 {
                    margin-top: -10px;
                    margin-left: 10px;
                    z-index: 1;
                }



            </style>
            <div class="palette">
                <div class="currentcolors">
                    <div class="swatch sw1" style="background: var(--accent-color)"></div>
                    <div class="swatch sw2" style="background: var(--secondary-color)"></div>
                </div>
                <div id="swatch-grid" class="swatch-grid">
                </div>
            </div>
        `;
    }
    connectedCallback() {
        const colorArray = ["#000000", "#FFFFFF", "#808080", "#C0C0C0",
                            "#FF0000", "#800000", "#FFFF00", "#808000",
                            "#00FF00", "#008000", "#00FFFF", "#008080",
                            "#0000FF", "#000080", "#FF00FF", "#800080"]
                            //"#FFFF80", "#808040", "#00FF80", "#004040",
                            //"#80FFFF", "#0080FF", "#8080FF", "#004080",
                            //"#FF0080", "#8000FF", "#FF8040", "#804000"]
        const swatches = this.shadowRoot.getElementById("swatch-grid");
        colorArray.forEach(color => {
            const sw = document.createElement("div");
            sw.setAttribute("class", "swatch");
            sw.setAttribute("style", `background:${color}`)
            sw.onclick = () => document.documentElement.style.setProperty("--accent-color", color);
            sw.oncontextmenu = () => {document.documentElement.style.setProperty("--secondary-color", color); return false} ;
            swatches.appendChild(sw);
        });
    }
}
customElements.define("my-palette", Palette);
