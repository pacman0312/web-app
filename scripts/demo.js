const touchScreen = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// const app = document.getElementById('app');

const appSettings = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    breakpoint: 500,
    lazyLoadingDelay: 300,
    positionElements: {
        beforeend: 'beforeend'
    }
};

const appContent = {
    main: {
        goods: {
            title: 'Выбирай и готовь',
            seeAll: {
                text: 'смотреть все',
                icon: 'не добавил'
            },
            loadingImg: 'images/loading.png',
            choose: 'Выбрать'
        },
    },
    back: {
        icon: 'images/icons/back.svg',
        goods: 'Мини рецепты'
    },
    form: {
        timeText: 'время готвки:',
        title: 'Необходимые продукты',
        nothing: 'из продуктов все есть',
        submit: '#',
        submitBtnText: 'Отправить'
    }
};

const lazyLoading = (elScroll, elImg, windowSize, page) => {
    const lazyLoadingImg = document.querySelectorAll(elImg);
    let lazyLoadingImgPositions = [];

    const lazy = el => {
        let indexImg = lazyLoadingImgPositions.findIndex(item => el > item - windowSize);
        
        if (indexImg >= 0) {
            let index = lazyLoadingImg[indexImg].dataset.src;

            if (index) {
                lazyLoadingImg[indexImg].src = lazyLoadingImg[indexImg].dataset.src;
                lazyLoadingImg[indexImg].removeAttribute('data-src');

                setTimeout(() => {
                    lazyLoadingImg[indexImg].classList.add('active');

                    // if (lazyLoadingImg[indexImg].classList.contains('active')) {
                    //     lazyLoadingImg[indexImg].offsetParent.offsetParent.children[2].classList.add('active');
                    // };
                }, appSettings.lazyLoadingDelay);
            }
            delete lazyLoadingImgPositions[indexImg]
        }
    };

    if (lazyLoadingImg.length > 0) {
        for (const img of lazyLoadingImg) {
            let dataSrc = img.dataset.src;

            if (page === 'x') {
                if (dataSrc) {
                    lazyLoadingImgPositions.push(img.getBoundingClientRect().left + pageXOffset);
                    lazy(pageXOffset);
                }
            } else if (page === 'y') {
                if (dataSrc) {
                    lazyLoadingImgPositions.push(img.getBoundingClientRect().top + pageYOffset);
                    lazy(pageYOffset);
                }
            }
        }
    }

    elScroll.addEventListener('scroll', function(event) {
        if (lazyLoadingImg.length > 0) {
            if (page === 'x') {
                const scroll = event.target.scrollLeft;
                lazy(scroll);
            } else if (page === 'y') {
                const scroll = event.target.scrollTop;
                lazy(scroll);
            }
        }
    });
};

const appBack = (element, title) => {
    element.insertAdjacentHTML('beforeend', `
        <div class="app-touch-back">
            <div class="app-touch-back__wrap">
                <div class="app-touch-back__icon">
                    <img src="${appContent.back.icon}" alt="iconBack">
                </div>
                <h2 class="app-touch-back__title">${title}</h2>
            </div>
        </div>
    `);
};

const appGetData = async (url, expectation) => {
    if (expectation === undefined) {
        const response = await fetch(url);
    
        if (!response.ok) throw new Error(`in url: ${response.url} Status: ${response.status}`);

        return await response.json();
    } else {
        const parent = expectation.parentElement;

        parent.insertAdjacentHTML(appSettings.positionElements.beforeend, `
            <div class="expectation">
                <span></span>
            </div>
        `);
    
        const response = await fetch(url);
    
        if (!response.ok) throw new Error(`in url: ${response.url} Status: ${response.status}`);
    
        setTimeout(() => {
            parent.children[1].classList.add('active');
        }, 500);
    
        return await response.json();
    }
};

const appCreateElements = (app, appTag, appTagClass, appTagPosition) => {
    const element = document.createElement(appTag);
    element.className = appTagClass;

    app.insertAdjacentElement(appTagPosition, element);

    return element;
};

const createGoodsInMain = (good, createGoodsInMainTouch) => {
    const {
        id, name, nameMin, img, ingredients: ing, category, time, main
    } = good;

    const goodCode = `
        <div class="good" data-name="${name}" data-ingredients="${ing}" data-img="${img}" data-time="${time}">
            <div class="good__content">
                <div class="good__wrap">
                    <div class="good__wrap-img">
                        <img data-src="${img}" src="${appContent.main.goods.loadingImg}" alt="good-img-${id}" class="good__img">
                    </div>
                    <div class="good__time">${time}</div>
                    <div class="good__pepper"></div>
                </div>
                <div class="good__wrap-text">
                    <div class="good__name">${name}</div>
                    <div class="good__choose">${appContent.main.goods.choose}</div>
                </div>
            </div>
        </div>
    `;

    if (main !== '') {
        createGoodsInMainTouch.insertAdjacentHTML('beforeend', goodCode);
    }
};

const goodsCreateContent = (appTouchGoods, back) => {
    // appTouchGoods.classList.add('active');

    const goodsScroll = document.querySelector('.app-touch-good__scroll');

    back(goodsScroll, appContent.back.goods);

    goodsScroll.insertAdjacentHTML('beforeend', `
        <section class="app-touch-good__categories">
            <div class="app-touch-good__categories-scroll"></div>
        </section>
        <section class="app-touch-good__goods">
            <div class="app-touch-good__goods-wrap"></div>
        </section>
    `);

    const goodsCategories = document.querySelector('.app-touch-good__categories-scroll');
    const goodsGoods = document.querySelector('.app-touch-good__goods-wrap');

    appGetData('./db/categories.json').then(data => {
        data.forEach((category, ind) => {
            ind++;
            if (ind === 1) {
                goodsCategories.insertAdjacentHTML('beforeend', `<div class="app-touch-good__categories-el active" data-filter="${category.name}">
                    <span>${category.name}</span>
                </div>`);   
            } else {
                goodsCategories.insertAdjacentHTML('beforeend', `<div class="app-touch-good__categories-el" data-filter="${category.name}">
                    <span>${category.name}</span>
                </div>`);
            }
        });
    });

    appGetData('./db/goods.json', goodsGoods).then(data => {
        data.forEach(good => {
            const {
                id, name, nameMin, img, ingredients: ing, category, time, main
            } = good;

            goodsGoods.insertAdjacentHTML('beforeend', `
                <div class="good" data-filter="${category}" data-name="${name}" data-ingredients="${ing}" data-img="${img}" data-time="${time}">
                    <div class="good__content">
                        <div class="good__wrap">
                            <div class="good__wrap-img">
                                <img data-src="${img}" src="${appContent.main.goods.loadingImg}" alt="good-img-${id}" class="good__img">
                            </div>
                            <div class="good__time">${time}</div>
                            <div class="good__pepper"></div>
                        </div>
                        <div class="good__wrap-text">
                            <div class="good__name">${name}</div>
                            <div class="good__choose">${appContent.main.goods.choose}</div>
                        </div>
                    </div>
                </div>
            `);            
        });
        lazyLoading(goodsScroll, 'img[data-src]', appSettings.height, 'y');
    });  

    appTouchGoods.addEventListener('click', function(event) {
        const target = event.target;
        const category = target.closest('.app-touch-good__categories-el');
        const back = target.closest('.app-touch-back__icon');

        if (category) {
            const categories = document.querySelectorAll('.app-touch-good__categories-el');
            const goods = document.querySelectorAll('.good');

            const dataFilter = category.dataset.filter;
            
            for (const category of categories) {
                category.classList.remove('active');
            }
            category.classList.add('active');
            goodsScroll.scrollTop = 0;
            
            for (const good of goods) {
                good.classList.remove('show');
                good.classList.add('hide');

                if (good.dataset.filter === dataFilter || dataFilter === "все") {
                    good.classList.add('show');
                    good.classList.remove('hide');
                }
            }

            
            lazyLoading(goodsScroll, 'img[data-src]', appSettings.height, 'y');
        };

        if (back) {
            this.classList.remove('active');
            goodsScroll.textContent = '';
        };

    });
};

const openForm = (form, name, cleanName, ingredients, img, time) => {
    form.formNameS.setAttribute('value', cleanName);
    const ingredientsArr = ingredients.split(', ');

    form.formGood.insertAdjacentHTML(appSettings.positionElements.beforeend, `
        <div class="form__good-img">
            <img src="${img}" alt="formGoodImg">
        </div>
        <div class="form__good-wrap">
            <div class="form__good-name">${name}</div>
            <div class="form__good-time">${appContent.main.goods.choose + ' ' + time}</div>
        </div>
    `);

    for (const ingredient of ingredientsArr) {
        form.fromIngredients.insertAdjacentHTML('beforeend', `
            <div class="form__ingredient-el">
                <span class="form__ingredient-chec"></span>
                <span class="form__ingredient-name">${ingredient}</span>
            </div>
        `);
    };
    form.fromIngredients.insertAdjacentHTML('beforeend', `
        <div class="form__ingredient-el nothing">
            <span class="form__ingredient-chec"></span>
            <span class="form__ingredient-name">${appContent.form.nothing}</span>
        </div>
    `); 

    form.appTouchForm.classList.add('active');
    setTimeout(() => {
        form.formWrapForm.classList.add('active');
    }, 300);

    const ingElements = document.querySelectorAll('.form__ingredient-el');
    const ingElementNothing = document.querySelector('.form__ingredient-el.nothing');
    let ingArr = [];

    for (const ing of ingElements) {
        const ingName = ing.children[1].textContent;
        
        ing.addEventListener('click', function() {
            this.classList.toggle('active');

            if (ing.classList.contains('active')) {
                ing.classList.add('active');

                if (ingName === appContent.form.nothing) {
                    ingArr = [];

                    for (const ing2 of ingElements) {
                        ing2.classList.remove('active');
                    }
                    ingElementNothing.classList.add('active');

                    ingArr.push(ingElementNothing.children[1].textContent);
                } else {
                    ingElementNothing.classList.remove('active');

                    const ingredients = ingArr.find(item => item === appContent.form.nothing);
                    if (ingredients) ingArr.splice(ingArr.indexOf(ingredients), 1);

                    ingArr.push(ingName);
                };
            } else {
                ing.classList.remove('active');
                
                if (ingName === appContent.form.nothing) {
                    ingArr = [];
                } else {
                    const ingredients = ingArr.find(item => item === ingName);
                    if (ingredients) ingArr.splice(ingArr.indexOf(ingredients), 1);
                };
            };
            
            form.fromIngredientsS.setAttribute('value', ingArr.join(', '));
        });
    };
}; 
const closeForm = form => {
    form.formWrapForm.classList.remove('active');

    setTimeout(() => {
        form.appTouchForm.classList.remove('active');

        setTimeout(() => {
            form.formNameS.setAttribute('value', '');
            form.fromIngredientsS.setAttribute('value', '');
            form.formGood.textContent = '';
            form.fromIngredients.textContent = '';
        }, 100);
    }, 300);
};

const initialization = (appTouch, sectionGoods, goodsCreateContent, appTouchGoods, back, form, openForm, closeForm) => {

    appTouch.addEventListener('click', function(e) {
        const good = e.target.closest('.good');

        if (good) { 
            const goodName = good.dataset.name;
            const goodCleanName = goodName.split(' <br> ').join(' ');
            const goodIngredients = good.dataset.ingredients;
            const goodImg = good.dataset.img;
            const goodTime = good.dataset.time;
            const goodChoose = good.querySelector('.good__choose');

            goodChoose.classList.add('active');
            setTimeout(() => {
                goodChoose.classList.remove('active');
            }, 1000);

            openForm(form, goodName, goodCleanName, goodIngredients, goodImg, goodTime);
        } else return;
    });

    sectionGoods.addEventListener('click', function(e) {
        const seeAll = e.target.closest('#see-all-goods');
        
        if (seeAll) {
            appTouchGoods.classList.add('active');
            setTimeout(() => goodsCreateContent(appTouchGoods, back), 100);
        } else return;
    });

    form.formClose.addEventListener('click', function() {
        if (this.nextElementSibling.classList.contains('active')) closeForm(form);
        else return;
    });
    form.formWrapForm.addEventListener('swiped-down', function(event) {
        closeForm(form);
    });
};

const appTouch = (
    back,
    createElements,
    createGoodsInMain,
    goodsCreateContent,
    init,
    openForm,
    closeForm
) => {
    app.classList.add('app_TOUCH');

    const appTouch = createElements(app, 'div', 'app-touch', appSettings.positionElements.beforeend);
    const appTouchMain = createElements(appTouch, 'main', 'app-touch-main', appSettings.positionElements.beforeend);
    const appTouchGoods = createElements(appTouch, 'div', 'app-touch-good', appSettings.positionElements.beforeend);
    const appTouchForm = createElements(appTouch, 'div', 'app-touch-form', appSettings.positionElements.beforeend);
    
    appTouchMain.insertAdjacentHTML(appSettings.positionElements.beforeend, `
        <div class="app-touch-main__scroll">
            <section class="app-touch-main__section app-touch-main__section_goods">
                <h1 class="app-touch-title app-touch-title_goods">${appContent.main.goods.title}</h1>
                <div class="app-touch-main__goods goods">
                    <div class="goods__see-all">
                        <span id="see-all-goods">${appContent.main.goods.seeAll.text}</span>
                    </div>
                    <div class="goods__wrap-scroll">
                        <div id="create-goods-in-main" class="goods__scroll after"></div>
                    </div>
                </div>
            </section>
        </div>
    `);

    appTouchGoods.insertAdjacentHTML(appSettings.positionElements.beforeend, `<div class="app-touch-good__scroll"></div>`);

    appTouchForm.insertAdjacentHTML(appSettings.positionElements.beforeend, `
        <div class="app-touch-form__close"></div>
        <div class="app-touch-form__wrap-form" data-swipe-threshold="20" data-swipe-timeout="500" data-swipe-ignore="false">
            <div class="app-touch-form__swipe"></div>
            <form action="${appContent.form.submit}" id="form" class="form">
                <input class="form__name-submit" type="text" name="name" value="">
                <input class="form__ingredients-submit" type="text" name="ingredients" value="">
                <div class="form__good"></div>
                <div class="form__title">
                    <h2>${appContent.form.title}</h2>
                </div>
                <div class="form__ingredients"></div>
                <div class="form__btn">
                    <button class="form__btn-submit cursor-none" type="submit">${appContent.form.submitBtnText}</button>
                </div>
            </form>
        </div>
    `);

    const createGoodsInMainTouch = document.getElementById('create-goods-in-main');
    const sectionGoodsInMainTouch = document.querySelector('.app-touch-main__section_goods');

    const form = {
        appTouchForm: appTouchForm,
        formGood: document.querySelector('.form__good'),
        formClose: appTouchForm.children[0],
        formWrapForm: appTouchForm.children[1],
        form: document.getElementById('form'),
        formNameS: document.querySelector('.form__name-submit'),
        fromIngredientsS: document.querySelector('.form__ingredients-submit'),
        fromIngredients: document.querySelector('.form__ingredients'),
    }

    appGetData('./db/goods.json', createGoodsInMainTouch).then(data => {
        data.forEach(good => createGoodsInMain(good, createGoodsInMainTouch));
        console.log(':: In main', createGoodsInMainTouch.children.length, 'elmenets');
        lazyLoading(createGoodsInMainTouch, 'img[data-src]', appSettings.width, 'x');
    });

    init(appTouch, sectionGoodsInMainTouch, goodsCreateContent, appTouchGoods, back, form, openForm, closeForm);
};
const appDesktop = () => app.classList.add('app_DESKTOP');

if (touchScreen) appTouch(
    appBack,
    appCreateElements,
    createGoodsInMain,
    goodsCreateContent,
    initialization,
    openForm,
    closeForm
);
else appDesktop();