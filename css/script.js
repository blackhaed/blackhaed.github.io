let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});
window.addEventListener('touchend', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// multilingual
function multilingualContainerHandler(container, div) {
    var KoEn = document.querySelectorAll(div);
    for (var i = 0; i < KoEn.length; i++) {
        KoEn[i].classList.add('ko-en');
    }
    jQuery(`${container} .ko-en`).each(function () {
        jQuery(this).multilingual(['num', 'punct', 'en']);
    });
}
function multilingualHandler(div) {
    var KoEn = document.querySelectorAll(div);
    for (var i = 0; i < KoEn.length; i++) {
        KoEn[i].classList.add('ko-en');
    }
    jQuery('.ko-en').each(function () {
        jQuery(this).multilingual(['num', 'punct', 'en']);
    });
}

jQuery(function () {
    jQuery(document).ready(function () {
        multilingualHandler(
            '#main-content .et_pb_text_inner, .ml, .team-text, .item-loop .item-text, .project-detail-wrap'
        );
    });
});

// list, grid view
const changer = document.querySelector('.project-layout-changer');
const toggle = document.querySelector('.list-selector-toggle');

function List(a, b) {
    if (a == 0) {
        changer.classList.add('list-01');
        changer.classList.remove('list-02');
        changer.classList.remove('list-03');
        toggle.classList.add('list-01');
        toggle.classList.remove('list-02');
        toggle.classList.remove('list-03');
    } else if (a == 1) {
        changer.classList.remove('list-01');
        changer.classList.add('list-02');
        changer.classList.remove('list-03');
        toggle.classList.remove('list-01');
        toggle.classList.add('list-02');
        toggle.classList.remove('list-03');
    } else if (a == 2) {
        changer.classList.remove('list-01');
        changer.classList.remove('list-02');
        changer.classList.add('list-03');
        toggle.classList.remove('list-01');
        toggle.classList.remove('list-02');
        toggle.classList.add('list-03');
    }
    sessionStorage.setItem('List', a);
}

if (toggle) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(
        window.navigator.userAgent
    );
    const listStatus = sessionStorage.getItem('List');

    if (!listStatus || listStatus == 0) {
        List(0);
    } else if (listStatus == 1) {
        List(1);
    } else if (listStatus == 2) {
        List(2);
    }
    if (!isMobile && !listStatus) {
        List(2);
    }
}

// intro image open
const intro_bg = document.querySelector('.intro-section');
const intro_menu = document.querySelector('.iroje-main-menu');
if (intro_bg && intro_menu) {
    function handleOnclick() {
        intro_bg.classList.add('hide');
        intro_menu.classList.add('show');
    }
    intro_bg.addEventListener('click', handleOnclick);
    intro_bg.addEventListener('touchmove', handleOnclick);
}

// mobile menu -> body 밑으로 이동
const m_menu = document.querySelector('.mobile-menu-wrap');
if (m_menu) {
    document.body.append(m_menu);
}

// 윈도우에서 noto sans 불러오기
const isWindows = /Windows/i.test(navigator.userAgent);
const link = document.createElement('link');
link.href =
    'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap';
link.rel = 'stylesheet';

if (isWindows) {
    document.getElementsByTagName('head')[0].appendChild(link);
    document.body.classList.add('iswindows');
}
