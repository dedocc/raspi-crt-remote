class Playlist extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                }

                .wrapper {
                    border: 3px solid #e2e2e2;
                    background-color: #C0C0C0;
                    overflow: hidden;
                }
                .content {
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                li.selected {
                    background: var(--accent-color);
                    color: var(--secondary-color);
                }
                    
                ::-webkit-scrollbar {
                    width: 20px;
                }
                 
                ::-webkit-scrollbar-track {
                    background: repeating-conic-gradient(#bfbfbf 0 25%, #0000 0 50%) 50% / 3px 3px;
                }
                 
                ::-webkit-scrollbar-thumb {
                    box-shadow: 2px 2px 0px 0px #555,
                                1px 1px 0px 0px #c0c0c0 inset,
                                2px 2px 0px 0px #fff inset;
                    background-color: #c0c0c0;
                }

                .list {
                    height: 400px;
                    padding: 5px;
                    margin: 10px;
                    list-style-type: none;
                    background-color: #fff;
                    border: 1px solid #000;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
            </style>

            
            <div class="wrapper">
                <my-titlebar icon="img/folder.webp" title="Playlist"></my-titlebar>
                <div class="content">
                    <ul id="list" class="list"></ul>
                </div>
            </div>
        `;
    }
    async connectedCallback() {
        const response = await fetch(`http://${location.hostname}:8081/list-videos`);
        const fileListArray = await response.json();
        
        const list = this.shadowRoot.getElementById("list");
        fileListArray.forEach(itemText => {
            const li = document.createElement("li");
            li.textContent = itemText;
            li.onclick = () => this.selectItem(li);            
            list.appendChild(li);
        });
    }

    selectItem(clickedLi) {
        this.shadowRoot.querySelectorAll('li').forEach(li => li.classList.remove('selected') );
        clickedLi.classList.add('selected');
        this.dispatchEvent(new CustomEvent('item-selected', {
            detail: { value: clickedLi.textContent },
            bubbles: true,
            composed: true
        }));
    }
}
customElements.define("my-playlist", Playlist);
