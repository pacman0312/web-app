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
    },
    form: {
        title: 'Необходимые продукты',
        everything: 'все',
        nothing: 'ничего'   
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
                <div class="app-touch-main__parallax"></div>
                <div class="app-touch-main__look">
                    Look
                </div>
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
const createAppTouchForm = (app, createEl, el, elClass, elPosition, content) => {
    const element = createEl(app, el, elClass, elPosition);

    const elementCode = `
        <div class="app-touch-form__close"></div>
        <div class="app-touch-form__wrap-form">
            <div class="app-touch-form__swipe"></div>
            <form action="#" id="form" class="form">
                <input class="form__name" type="text" name="name" value="">
                <div class="form__title">
                    <h2>${content.title}</h2>
                </div>
                <div class="form__ingredients"></div>
                <div class="form__btn">
                    <button class="form__btn-submit cursor-none" type="submit">Отправить</button>
                </div>
            </form>
        </div>
    `; 

    element.insertAdjacentHTML(elPosition, elementCode);
    return element;
};

const openForm = (appTF, fWrapForm, fName, fIngredients, name, ingredients, content) => {

    fName.setAttribute('value', name);
    const ingredientsArr = ingredients.split(', ');

    for (const ingredient of ingredientsArr) {
        fIngredients.insertAdjacentHTML('beforeend', `
            <div class="form__ingredient-el">
                <span class="form__ingredient-chec"></span>
                <span class="form__ingredient-name">${ingredient}</span>
            </div>
        `);
    };
    fIngredients.insertAdjacentHTML('beforeend', `
        <div class="form__ingredient-el">
            <span class="form__ingredient-chec"></span>
            <span class="form__ingredient-name">${content.everything}</span>
        </div>
        <div class="form__ingredient-el">
            <span class="form__ingredient-chec"></span>
            <span class="form__ingredient-name">${content.nothing}</span>
        </div>
    `); 

    appTF.style.opacity = '1';
    appTF.style.visibility = 'visible';

    setTimeout(() => {
        fWrapForm.style.transform = 'translateY(0%)';
    }, 300);

    const ingEl = document.querySelectorAll('.form__ingredient-el');
    let ingElArr = [];

    for (const ing of ingEl) {
        const ingChec = ing.children[0];
        const ingName = ing.children[1].textContent;

        ing.addEventListener('click', function() {
            ingChec.classList.toggle('active');

            if (ingChec.classList.contains('active')) {
                ingElArr.push(ingName);
            } else {
                const food = ingElArr.find((ing) => {
                    return ing === ingName;
                });

                if (food) ingElArr.splice(ingElArr.indexOf(food), 1);
            }

            console.log(ingElArr);
        }, false);
    };
};

const closeForm = (appTF, fWrapForm, fName, fIngredients) => {
    fWrapForm.style.transform = 'translateY(100%)';

    setTimeout(() => {
        appTF.style.opacity = '0';
        appTF.style.visibility = 'hidden';
        
        setTimeout(() => {
            fName.setAttribute('value', '');
            fIngredients.textContent = '';
        }, 100);
    }, 300);
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
    cAppTouchForm,
    openForm,
    closeForm,
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
    const appTouchForm = cAppTouchForm(appTouch, cElements, 'div', 'app-touch-form', 'beforeend', contentApp.form);

    const toCreateGoods = document.querySelector('.goods__scroll');
    
    const formClose = appTouchForm.children[0];
    const formWrapForm = appTouchForm.children[1];
    const formSwipe = formWrapForm.children[0];
    const formName = document.querySelector('.form__name');
    const fromIngredients = document.querySelector('.form__ingredients');

    let formSwipeX = null;
    let formSwipeY = null;

    appLog(appTouch, appTouchMain, appTouchGood, appTouchForm);

    toCreateGoods.addEventListener('click', function(event) {
        const target = event.target;
        const item = target.closest('.good');

        if (item) {
            const itemName = item.dataset.name;
            const itemCleanName = itemName.split(' <br> ').join(' ');
            const itemIngredients = item.dataset.ingredients;

            openForm(appTouchForm, formWrapForm, formName, fromIngredients, itemCleanName, itemIngredients, contentApp.form);
        };
    }, false);

    formClose.addEventListener('click', function() {
        closeForm(appTouchForm, formWrapForm, formName, fromIngredients);
    }, false);
    formSwipe.addEventListener('touchstart', function(event) {
        const formSwipe = event.touches[0];
        formSwipeX = formSwipe.clientX;
        formSwipeY = formSwipe.clientY;
    }, false);
    formSwipe.addEventListener('touchmove', function(event) {
        if (!formSwipeX || !formSwipeY) return false;

        const formSwipe = event.touches[0];

        let formSwipeX2 = formSwipe.clientX;
        let formSwipeY2 = formSwipe.clientY;
        
        let formSwipeXDiff = formSwipeX2 - formSwipeX;
        let formSwipeYDiff = formSwipeY2 - formSwipeY;

        if (Math.abs(formSwipeYDiff) > Math.abs(formSwipeXDiff)) {
            if (formSwipeYDiff > 0) {
                closeForm(appTouchForm, formWrapForm, formName, fromIngredients);
            };
            return false; 
        }
    }, false);

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
        createAppTouchForm,
        openForm,
        closeForm,
    );
} else appDesktop()