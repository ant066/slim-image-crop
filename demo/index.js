import Editor from '../src';
const editor = new Editor('#editor', { modules: ['crop', 'text'] });
const url = 'https://www.elle.vn/wp-content/uploads/2019/03/20/elle-viet-nam-phong-cach-thoi-trang-jisoo-Blackpink-2.png';
const url2 = 'https://static.yeah1music.net/uploads/Vy/5c8237ad2b13c.png'
// editor.draw('https://i-ione.vnecdn.net/2019/06/05/group-teaser-image-black-pink-1433-7164-1559731438.png')
editor.draw(url2)