import './assets/scss/editor.scss';
import CropModule from './modules/crop';

import TOOLBAR_DEFAULT_ICON from './assets/icon/default.svg';

class Editor {
    _bind() {
        this.initWrapper = this._initWrapper.bind(this);
        this.initToolbar = this._initToolbar.bind(this)
        this.initModules = this._initModules.bind(this)
        this.initSubToolbar = this._initSubToolbar.bind(this)
        this.initCanvas = this._initCanvas.bind(this)
        this.draw = this._draw.bind(this)

    }

    constructor(wrapperEl, options = {}) {
        this._bind.call(this);

        if (!this.initWrapper(wrapperEl)) throw new Error('Wrapper element must be query string or Element!');

        this.initModules(options.modules);
        this.initToolbar();
        this.initSubToolbar();
        this.initCanvas();
    }

    _initWrapper(wrapperEl = '') {
        if (typeof wrapperEl === 'string') {
            this.wrapperEl = document.querySelector(wrapperEl);
        } else {
            this.wrapperEl = wrapperEl;
        }
        if (!(this.wrapperEl instanceof HTMLElement)) return false;
        this.el = document.createElement('div');
        this.el.classList.add('spe-main');
        this.wrapperEl.appendChild(this.el);
        return true;
    }

    _initModules(modules = []) {
        this.modules = [];
        modules.forEach(modl => {
            switch (modl) {
                case 'crop': {
                    this.modules.push(new CropModule(this));
                }
                default:
            }
        })
    }
    _initCanvas() {
        this.canvasWrapperEl = document.createElement('div');
        this.canvasWrapperEl.classList.add('spe-canvas-wrapper');

        this.canvasEl = document.createElement('canvas');
        this.canvasWrapperEl.appendChild(this.canvasEl);

        this.ctx = this.canvasEl.getContext("2d");

        this.el.appendChild(this.canvasWrapperEl);
    }

    _initToolbar() {
        this.toolbarEl = document.createElement('div');
        this.toolbarEl.classList.add('spe-toolbar');
        this.modules.forEach(modl => {
            const toolbarItem = document.createElement('div');
            toolbarItem.classList.add('spe-toolbar-item');

            const { icon = TOOLBAR_DEFAULT_ICON, title } = modl.options;

            toolbarItem.innerHTML = icon;
            toolbarItem.setAttribute('title', title);
            toolbarItem.addEventListener('click', () => {
                if (modl.menu) {
                    this.subToolbarEl.innerHTML = '';
                    this.subToolbarEl.appendChild(modl.menu);
                    this.subToolbarEl.show();
                } else {
                    this.subToolbarEl.hide();
                }
                if (modl.action) modl.action();
            });

            this.toolbarEl.appendChild(toolbarItem);
        });
        this.el.appendChild(this.toolbarEl);
    }

    _initSubToolbar() {
        this.subToolbarEl = document.createElement('div');
        this.subToolbarEl.classList.add('spe-sub-toolbar');

        this.subToolbarEl.hide = () => this.subToolbarEl.style.display = 'none';
        this.subToolbarEl.show = () => this.subToolbarEl.style.display = 'block';

        this.el.appendChild(this.subToolbarEl);
    }

    _draw(url) {
        const img = new Image;
        img.setAttribute('crossOrigin','anonymous')
        img.src = url;
        img.onload = () => {
            this.canvasEl.setAttribute('height', img.height + 'px')
            this.canvasEl.setAttribute('width', img.width + 'px')
            this.ctx.drawImage(img, 0, 0);
        };
    }
}


export default Editor;