import Editor from '../src';
const editor = new Editor('#editor', { modules: ['crop', 'text', 'image'] });
const url = 'https://www.elle.vn/wp-content/uploads/2019/03/20/elle-viet-nam-phong-cach-thoi-trang-jisoo-Blackpink-2.png';
const url2 = 'https://znews-photo.zadn.vn/Uploaded/mne_jwmc2/2019_11_18/75043218_495168741082507_428919112333262848_n_1.jpg'
editor.draw(url2)
window.editor = editor