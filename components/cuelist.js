class Playlist extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
            </style>

            
            <div class="wrapper">
                <my-titlebar icon="img/folder.webp" title="Playlist"></my-titlebar>
                <div class="content">
                </div>
            </div>
        `;
    }
}
customElements.define("my-playlist", Playlist);
