import './image.scss';
import IMAGE_IC from "../../assets/icon/image.svg";
import SAVE_IC from "../../assets/icon/save.svg";
import { removeEl } from "../../utils/dom";

const DEFAULT_CONFIG = {
    icon: IMAGE_IC,
    title: "Image",
    menu: true,
    logo: 'https://static-znews.zadn.vn/images/logo-zing.svg'
};

class Image {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.options = { ...DEFAULT_CONFIG, options };

        this.init = this._init.bind(this);
        this.action = this._action.bind(this);
        this.createMenu = this._createMenu.bind(this);
        this.initEvents = this._initEvents.bind(this);
        this.insertLogo = this._insertLogo.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.removeSelected = this.removeSelected.bind(this);
        this.enablePosMenu = this.enablePosMenu.bind(this);
        this.disablePosMenu = this.disablePosMenu.bind(this);
        this.changeImagePos = this.changeImagePos.bind(this);
        this.applyImage = this.applyImage.bind(this);

        this.init();
    }

    _init() {
        if (this.menu) return;
        this.menu = this.createMenu();
        this.imageList = this.menu.querySelector('.spe-image-item-list');

        this.initEvents();
    }

    _action() {
        this.editor.canvasEl.addEventListener('click', this.removeSelected);
    }

    _createMenu() {
        const menu = document.createElement("div");
        menu.classList.add("spe-image-menu");
        const html = `<div class='spe-image'>
                            <img src='${this.options.logo}'/>
                        </div>
                        <div class="spe-image-insert">Chèn</div>

                        <div class='spe-image-pos-box spe-disabled'>
                            <div class='spe-pos-tl' data-value='TL'>TL</div>
                            <div class='spe-pos-tr' data-value='TR'>TR</div>
                            <div class='spe-pos-ce' data-value='CE'>CE</div>
                            <div class='spe-pos-bl' data-value='BL'>BL</div>
                            <div class='spe-pos-br' data-value='BR'>BR</div>
                        </div>

                        <div class="spe-image-save">${SAVE_IC}</div>
                    </div>
                    
                    <div class="spe-image-item-list"></div>
                    `;

        menu.innerHTML = html;
        this.insertBtn = menu.querySelector('.spe-image-insert');
        this.saveBtn = menu.querySelector('.spe-image-save');
        this.posMenu = menu.querySelector('.spe-image-pos-box');
        this.posMenuBtns = [...this.posMenu.querySelectorAll('div')];

        return menu;
    }

    _initEvents() {
        this.insertBtn.addEventListener("click", () => this.insertLogo())
        this.posMenuBtns.forEach(btn => {
            btn.addEventListener('click', this.changeImagePos)
        });
        this.saveBtn.addEventListener("click", this.applyImage)
    }

    _insertLogo(src = this.options.logo) {
        const logo = document.createElement('div');
        logo.classList.add('spe-image-watermark');

        const { height, width, left, top } = this.editor.canvasEl.getBoundingClientRect();
        const img = document.createElement('img');
        img.setAttribute('crossOrigin', 'anonymous');
        img.setAttribute('src', src);
        logo.appendChild(img);
        this.imageList.appendChild(logo);

        img.onload = () => {
            const imgRect = img.getBoundingClientRect();
            const ratio = imgRect.height / imgRect.width;
            const logoHeight = height / 10;
            const logoWidth = logoHeight / ratio;
            logo.style.height = logoHeight + 'px';
            logo.style.width = logoWidth + 'px';
            logo.style.left = left + width - logoWidth;
            logo.style.top = top + height - logoHeight;
            img.style.height = '100%';
            img.style.width = '100%';
            logo.addEventListener('click', () => this.handleSelectImage(logo))
        }
    }
    changeImagePos(evt) {
        const target = evt.target;
        const pos = target.getAttribute('data-value');
        const { height, width, left, top } = this.editor.canvasEl.getBoundingClientRect();
        const { height: imgHeight, width: imgWidth } = this.imageEl.getBoundingClientRect();
        let imageLeft, imageTop;
        switch (pos) {
            case 'TL': {
                imageTop = top;
                imageLeft = left;
                break;
            }
            case 'TR': {
                imageTop = top;
                imageLeft = left + width - imgWidth;
                break;
            }
            case 'CE': {
                imageTop = top + (height / 2) - imgHeight / 2;
                imageLeft = left + (width / 2) - imgWidth / 2;
                break;
            }
            case 'BL': {
                imageTop = top + height - imgHeight;
                imageLeft = left;
                break;
            }
            case 'BR': {
                imageTop = top + height - imgHeight;
                imageLeft = left + width - imgWidth;
                break;
            }
        }
        this.imageEl.style.left = imageLeft + 'px';
        this.imageEl.style.top = imageTop + 'px';
    }
    removeSelected() {
        const images = this.imageList.querySelectorAll('.spe-image-watermark');

        [...images].forEach(image => {
            image.style.border = " 2px solid transparent";
            image.style.cursor = "move";
        });
        this.imageEl = null;
        this.disablePosMenu();
    }

    enablePosMenu() {
        this.posMenu.classList.remove('spe-disabled')
    }

    disablePosMenu() {
        this.posMenu.classList.add('spe-disabled')
    }

    handleSelectImage(el) {
        this.removeSelected();

        this.isMouseDown = false;
        this.imageEl = el;
        this.imageEl.style.border = " 2px dashed #fff";
        this.imageEl.style.cursor = 'move';
        this.imageEl.addEventListener('mousedown', this.onMouseDown);
        this.enablePosMenu();
    }

    onMouseDown(evt) {
        this.isMouseDown = true;
        const { height, width, left, top } = this.imageEl.getBoundingClientRect();
        const { pageX, pageY } = evt;
        this.imageLeft = pageX - left;
        this.imageTop = pageY - top;
        evt.stopPropagation();
        evt.preventDefault();
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        this.editor.canvasEl.addEventListener('mouseleave', this.onMouseUp);
    }

    onMouseMove(evt) {
        if (!this.isMouseDown || !this.imageEl) return;
        const { pageX, pageY } = evt;
        this.imageEl.style.top = pageY - this.imageTop;
        this.imageEl.style.left = pageX - this.imageLeft;
    }

    onMouseUp() {
        this.isMouseDown = false;
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onMouseUp);
    }

    applyImage() {
        const images = this.imageList.querySelectorAll('.spe-image-watermark');
        const canvasRect = this.editor.canvasEl.getBoundingClientRect();
        const ratio = this.editor.canvasEl.height / canvasRect.height;

        [...images].forEach(image => {
            const imgEl = image.querySelector('img')
            imgEl.setAttribute("crossOrigin", "Anonymous");
            const rect = image.getBoundingClientRect();
            const exacX = (rect.left - canvasRect.left) * ratio;
            const exacY = (rect.top - canvasRect.top) * ratio;
            const exacWidth = (rect.width - 2) * ratio;
            const exacHeight = (rect.height - 2) * ratio;
            this.editor.ctx.drawImage(imgEl, exacX, exacY, exacWidth, exacHeight);
            image.remove();
        });
    }
}


export default Image