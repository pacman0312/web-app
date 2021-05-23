const touchScreen = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const app = document.getElementById('app');

const windowWidth = window.innerWidth;
const breakpointWidth = 500;

const hideAppLog = '-- Hide app';
const showAppLog = '-- Show app';

const contentApp = {
    main: {
        goods: {
            title: 'Выбирай и готовь!',
            seeAll: 'see all'
        }
    }
};

const hideApp = () => {
    app.style.transition = 'all .3s ease 0s';
    app.style.opacity = '0';
    app.style.visibility = 'hidden';
    console.log(hideAppLog);
};

const showApp = () => {
    app.style.opacity = '1';
    app.style.visibility = 'visible';
    console.log(showAppLog);
};

const resizeApp = (hide, show) => {
    if (windowWidth > breakpointWidth) {
        hide();
    } else {
        show();
    }
};

const appGetData = async url => {
    const response = await fetch(url);

    if (!response.ok) throw new Error(`in url: ${response.url} Status: ${response.status}`);

    return await response.json();
};

const createElements = (app, tag, tagClass, tagPosition) => {
    const element = document.createElement(tag);
    element.className = tagClass;

    app.insertAdjacentElement(tagPosition, element);
    return element;
};

const createAppTouch = (app, createEl, el, elClass, elPosition) => {
    const element = createEl(app, el, elClass, elPosition);
    return element;
};
const createAppTouchMain = (app, createEl, el, elClass, elPosition, content) => {
    const element = createEl(app, el, elClass, elPosition);

    const elementCode = `
        <div class="app-touch-main__scroll">
            <section class="app-touch-main__section app-touch-main__section_screen">
                
            </section>
            <section class="app-touch-main__section app-touch-main__section_goods">
                <h1 class="app-touch-title app-touch-title_goods">${content.goods.title}</h1>
                <div class="app-touch-main__goods goods">
                    <div class="goods__see-all">
                        <span id="see-all-goods">${content.goods.seeAll}</span>
                    </div>
                    <div class="goods__wrap-scroll">
                        <div class="goods__scroll after"></div>
                    </div>
                </div>
            </section>
        </div>
    `;
    
    element.insertAdjacentHTML(elPosition, elementCode);

    return element;
};
const createAppTouchGoods = (app, createEl, el, elClass, elPosition) => {
    const element = createEl(app, el, elClass, elPosition);
    return element;
};
const createAppTouchForm = (app, createEl, el, elClass, elPosition) => {
    const element = createEl(app, el, elClass, elPosition);
    return element;
};

const appLog = (t, tm, tg, tf) => {
    console.log(t);
    console.log(tm);
    console.log(tg);
    console.log(tf);
};

const appTouch = (
    resize,
    cElements,
    cAppTouch,
    cAppTouchMain,
    cAppTouchGoods,
    cAppTouchForm
) => {
    resize(hideApp, showApp);

    appGetData('./db/goods.json').then(data => {

        data.forEach(good => {
            const {
                id, name, nameMin, img, ingredients: ing, category, time, main
            } = good;

            const goodCode = `
                <div class="good" data-name="${name}" data-ingredients="${ing}">
                    <div class="good__content">
                        <div class="good__wrap-img">
                            <img src="${img}" alt="good-img-${id}" class="good__img">
                            <span class="good__time">${time}</span>
                        </div>
                        <div class="good__wrap-text">
                            <div class="good__name">${name}</div>
                        </div>
                    </div>
                </div>
            `;

            if (main !== '') {
                console.log(':: In main');
                toCreateGoods.insertAdjacentHTML('beforeend', goodCode);
            } else console.log(':: Not in main');
        });
    });

    const appTouch = cAppTouch(app, cElements, 'div', 'app-touch', 'beforeend');
    const appTouchMain = cAppTouchMain(appTouch, cElements, 'main', 'app-touch-main', 'beforeend', contentApp.main);
    const appTouchGood = cAppTouchGoods(appTouch, cElements, 'div', 'app-touch-good', 'beforeend');
    const appTouchForm = cAppTouchForm(appTouch, cElements, 'div', 'app-touch-form', 'beforeend');

    const toCreateGoods = document.querySelector('.goods__scroll');

    appLog(appTouch, appTouchMain, appTouchGood, appTouchForm);

    window.addEventListener('resize', function(windowWidth) {
        windowWidth = window.innerWidth;

        if (windowWidth > breakpointWidth) hideApp();
        else showApp();
    });
};

const appDesktop = () => console.log('desktop');


if (touchScreen) {
    appTouch(
        resizeApp,
        createElements,
        createAppTouch,
        createAppTouchMain,
        createAppTouchGoods,
        createAppTouchForm
    );
} else appDesktop()