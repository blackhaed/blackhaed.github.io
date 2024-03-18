// TODO: 현재 메뉴는 펼쳐져있게
// TODO: 서브메뉴 열릴 때 속도 맞추기
// TODO: 다른 서브메뉴 열면 자동으로 닫히게

const getElementStyle = (element, property) => {
    return window.getComputedStyle(element).getPropertyValue(property);
};

const getElementClientHeight = (element, container) => {
    // submenu, responsiveMenuMenu
    const prevEl = document.createElement('div');
    const containerWidth = getElementStyle(container, 'width');
    const containerPaddingLeft = getElementStyle(container, 'padding-left');
    const containerPaddingRight = getElementStyle(container, 'padding-right');

    prevEl.innerHTML = element.innerHTML;
    prevEl.style.position = 'fixed';
    prevEl.style.left = '-9999999999px';
    prevEl.style.top = '9999999999px';
    prevEl.style.width = `calc(${containerWidth} - ${containerPaddingLeft} - ${containerPaddingRight})`;
    prevEl.style.fontSize = '28px';

    const liNum = prevEl.querySelectorAll('a').length;
    document.body.appendChild(prevEl);
    const elHeight = prevEl.clientHeight + 11 * liNum * 2;

    prevEl.remove();

    return elHeight;
};

const responsiveMenuTrigger = document.querySelector(
    '.ep-responsivemenu-trigger'
);
const responsiveMenuContainer = document.querySelector(
    '.ep-responsivemenu-container'
);
const responsiveMenuMenu = document.querySelector(
    '.ep-responsivemenu-container'
);
let responsiveMenuStatus;
if (responsiveMenuTrigger)
    responsiveMenuStatus = responsiveMenuTrigger.dataset.menuToggle;
let responsiveMenuOpacity = 0;
let responsiveInitializing = false;

const responsiveMenuTrigHandler = () => {
    // close , open

    switch (responsiveMenuStatus) {
        case 'close':
            responsiveMenuStatus = 'open';
            responsiveMenuOpacity = 1;
            document.querySelectorAll('html')[0].classList.add('ep-not-scroll');

            responsiveMenuMenu.dataset.menuToggle = responsiveMenuStatus;
            setTimeout(() => {
                responsiveMenuMenu.style.opacity = responsiveMenuOpacity;
            }, 200);
            break;
        case 'open':
            responsiveMenuStatus = 'close';
            responsiveMenuOpacity = 0;
            document
                .querySelectorAll('html')[0]
                .classList.remove('ep-not-scroll');

            responsiveMenuMenu.style.opacity = responsiveMenuOpacity;
            setTimeout(() => {
                responsiveMenuMenu.dataset.menuToggle = responsiveMenuStatus;
            }, 200);
            break;
    }

    responsiveMenuTrigger.dataset.menuToggle = responsiveMenuStatus;
};

const responsiveToggleSubMenu = (submenu, parentMenu, clickedLi) => {
    if (responsiveMenuMenu.classList.contains('subfold-1')) {
        let subMenuHeight = getElementClientHeight(submenu, parentMenu);

        switch (submenu.dataset.subToggle) {
            case undefined:
                submenu.setAttribute('data-sub-toggle', true);
                clickedLi.setAttribute('data-sub-toggle', true);
                break;
            case 'true':
                submenu.dataset.subToggle = false;
                clickedLi.dataset.subToggle = false;
                subMenuHeight = 0;
                break;
            case 'false':
                submenu.dataset.subToggle = true;
                clickedLi.dataset.subToggle = true;
                break;
        }
        submenu.style.maxHeight = `${subMenuHeight}px`;
    }
};

const closeOpenedMenu = (current) => {
    const siblings = [].slice.call(current.parentElement.children);

    if (siblings) {
        siblings.forEach((sib) => {
            if (sib.dataset.subToggle === 'true') {
                const childSubmenu = sib.querySelector('.sub-menu');
                responsiveToggleSubMenu(childSubmenu, responsiveMenuMenu, sib);
            }
            if (
                current.parentElement.classList.contains(
                    'ep-responsivemenu-menus'
                ) &&
                current.querySelector('.sub-menu')
            ) {
                if (sib.dataset.subToggle === 'false') {
                    sib.querySelectorAll('.sub-menu').forEach((sub) => {
                        if (sub.dataset.subToggle === 'true') {
                            responsiveToggleSubMenu(
                                sub,
                                responsiveMenuMenu,
                                sib
                            );
                        }
                    });
                }
            }
        });
    }
};

const responsiveMenuAccordionHandler = (parentMenu) => {
    if (responsiveInitializing) {
        closeOpenedMenu(parentMenu);
    }

    const childSubmenu = parentMenu.querySelector('.sub-menu');
    if (childSubmenu) {
        responsiveToggleSubMenu(childSubmenu, responsiveMenuMenu, parentMenu);
    }

    if (childSubmenu) {
        parentMenu.addEventListener('click', () => {
            responsiveToggleSubMenu(
                childSubmenu,
                responsiveMenuMenu,
                parentMenu
            );
        });
    }
};

const responsiveOpenCurrentAccordion = () => {};

const ep_responsive_menu_init = () => {
    responsiveMenuMenu.style.opacity = responsiveMenuOpacity;
    responsiveMenuTrigger.addEventListener('click', responsiveMenuTrigHandler);
    if (responsiveMenuMenu.classList.contains('subfold-1')) {
        responsiveMenuMenu
            .querySelectorAll('.menu-item-has-children')
            .forEach((li) => {
                li.querySelector('a').addEventListener('click', (e) => {
                    e.preventDefault();
                });
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    responsiveMenuAccordionHandler(li);
                });
            });
    }

    document
        .querySelectorAll('.ep-responsivemenu-container .current-menu-ancestor')
        .forEach((li) => {
            responsiveMenuAccordionHandler(li);
        });
    responsiveInitializing = true;
};

if (responsiveMenuTrigger && responsiveMenuContainer && responsiveMenuMenu)
    ep_responsive_menu_init();
