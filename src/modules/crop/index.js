import './crop.scss';
import CROP_IC from '../../assets/icon/crop.svg';
import CROP_FRAME_IC from '../../assets/icon/crop-frame.svg';

const DEFAULT_CONFIG = {
    icon: CROP_IC,
    title: 'Crop',
    menu: true
}

class Crop {
    constructor(edtior, options = {}) {
        this.edtior = edtior;
        this.options = { ...DEFAULT_CONFIG, options };

        this.init = this._init.bind(this);
        this.action = this._action.bind(this);
        this.action = this._action.bind(this);
        this.createMenu = this._createMenu.bind(this);
        this.createMenuItem = this._createMenuItem.bind(this);
        this.initCropFrame = this._initCropFrame.bind(this);
        this.cropFrameMouseDownHandler = this._cropFrameMouseDownHandler.bind(this)
        this.cropFrameMouseMoveHandler = this._cropFrameMouseMoveHandler.bind(this)
        this.cropFrameMouseUpHandler = this._cropFrameMouseUpHandler.bind(this);
        this.setCropFramePosition = this.setCropFramePosition.bind(this)
        this.init();
    }

    _action() {
        this.initCropFrame()();
    }

    _init() {
        if (this.menu) {
            return this.menu;
        } else {
            return this.menu = this.createMenu();
        };
    }

    _createMenu() {
        const menu = document.createElement('div');
        menu.classList.add('spe-crop-menu');
        const items = [
            { title: 'Free', icon: CROP_FRAME_IC, action: this._initCropFrame() },
            { title: 'Square', icon: CROP_FRAME_IC, action: this._initCropFrame(1) },
            { title: '16/9', icon: CROP_FRAME_IC, action: this._initCropFrame(16 / 9) },
            { title: '5:4', icon: CROP_FRAME_IC, action: this._initCropFrame(5 / 4) },
            { title: '4:3', icon: CROP_FRAME_IC, action: this._initCropFrame(4 / 3) }];

        items.forEach(item => {
            menu.appendChild(this._createMenuItem(item))
        });
        return menu;
    }

    _createMenuItem(data) {
        const { icon, title, action } = data;
        const menuItem = document.createElement('div');
        menuItem.classList.add('spe-crop-menu-item');
        menuItem.innerHTML = icon + `<div class='spe-crop-menu-item-title'>${title}</div>`;
        menuItem.setAttribute('title', title);
        menuItem.addEventListener('click', action)
        return menuItem;
    }

    _initCropFrame(ratio) {
        return () => {
            const rect = this.edtior.canvasEl.getBoundingClientRect();
            const { left, top, bottom, right, height, width } = rect;

            if (!this.cropFrame) {
                this.cropFrame = document.createElement('div');
                this.cropFrame.classList.add('spe-crop-frame');
                this.cropFrame.addEventListener('mousedown', this.cropFrameMouseDownHandler)
                this.cropFrame.addEventListener('mousemove', this.cropFrameMouseMoveHandler)
                this.cropFrame.addEventListener('mouseup', this.cropFrameMouseUpHandler)
                this.cropFrame.addEventListener('mouseout', this.cropFrameMouseUpHandler)
                this.menu.appendChild(this.cropFrame);
            }

            const cropWidth = width / 2;
            const cropHeight = ratio ? cropWidth * ratio : height / 2;

            this.cropFrame.style.width = cropWidth
            this.cropFrame.style.height = cropHeight

            this.setCropFramePosition((left + right - cropWidth) / 2, (top + bottom - cropHeight) / 2)
        }
    }

    _cropFrameMouseDownHandler(e) {
        this.isMoving = true;
        const { clientX, clientY } = e;
        this.clientX = clientX;
        this.clientY = clientY;
        this.oldX = parseInt(this.cropFrame.style.left, 10)
        this.oldY = parseInt(this.cropFrame.style.top, 10);
    }

    _cropFrameMouseMoveHandler(e) {
        if (this.isMoving) {
            e.preventDefault();
            const { clientX, clientY } = e;

            const distantX = clientX - this.clientX;
            const distantY = clientY - this.clientY;


            const newX = this.oldX + distantX;
            const newY = this.oldY + distantY;
            this.setCropFramePosition(newX, newY);
        }
    }
    _cropFrameMouseUpHandler() {
        this.isMoving = false;
    }

    setCropFramePosition(x, y) {
        const rect = this.edtior.canvasEl.getBoundingClientRect();
        const { left, top, bottom, right } = rect;

        const cropFrameWidth = parseInt(this.cropFrame.style.width, 10);
        const cropFrameHeight = parseInt(this.cropFrame.style.height, 10);

        if (x < left) x = left;
        if (y < top) y = top;
        if (x + cropFrameWidth > right) x = right - cropFrameWidth;
        if (y + cropFrameHeight > bottom) y = bottom - cropFrameHeight;

        this.cropFrame.style.top = y;
        this.cropFrame.style.left = x
    }
}
export default Crop;