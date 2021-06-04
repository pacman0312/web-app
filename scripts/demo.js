const touchScreen = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// const app = document.getElementById('app');

const appSettings = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    breakpoint: 500,
    noScroll: 2000,
    sliderDelay: 300,
    lazyLoadingImgDelay: 300,
    lazyLoadingImg: 'images/loading.png',
    imgWelcome: './images/main/welcome/4.png',
    positionElements: {
        beforeend: 'beforeend'
    },
    sliders: {
        position: 0,
        slidesToScroll: 1
    }
};

const appContent = {
    main: {
        welcome: {
            // title: 'Welcome <br> to food',
            title: 'Choose <br> and cook',
            descr: 'Наслаждайся едой'
        },
        goods: {
            title: 'Recipes',
            seeAll: {
                text: 'смотреть все',
                icon: 'не добавил'
            },
            choose: 'Выбрать'
        },
        restaurants: {
            title: 'Restaurants',
            seeMenu: {
                text: 'меню',
                icon: 'не добавил'
            }
        }
    },
    back: {
        icon: 'images/icons/back.svg',
        goods: 'Рецепты'
    },
    form: {
        timeText: 'время готвки:',
        title: 'Необходимые продукты',
        nothing: 'из продуктов все есть',
        submit: '#',
        submitBtnText: 'Отправить'
    }
};

const lazyLoadingImg = async (elScroll, element, page) => {
    const elements = document.querySelectorAll(element);

    function lazy(scroll) {
        for (const element of elements) {
            let elementOffset = element.offsetTop;
            let elementPosition = 750;

            if (page === 'x') {
                elementOffset = element.offsetLeft;
                elementPosition = 300;
                lazyActiveImg(scroll, elementOffset, elementPosition, element);
            } 
            lazyActiveImg(scroll, elementOffset, elementPosition, element);
        }
    };

    function lazyActiveImg(scroll, elementOffset, elementPosition, element) {
        if (elementOffset >= 0) {
            if (scroll > elementOffset - elementPosition) {
                const img = element.querySelector('img');
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');

                    setTimeout(() => img.classList.add('active'), appSettings.lazyLoadingImgDelay);
                }
            }
        }
    };

    lazy(elScroll.offsetTop);

    elScroll.addEventListener('scroll', function(event) {
        if (page === 'x') lazy(event.target.scrollLeft);
        else lazy(event.target.scrollTop);
    });
};

const appBack = (element, title, el) => {
    element.insertAdjacentHTML(appSettings.positionElements.beforeend, `
        <div class="app-touch-back">
            <div class="app-touch-back__wrap">
                <div class="app-touch-back__icon">
                    <img src="${appContent.back.icon}" alt="iconBack">
                </div>
                <h2 class="app-touch-back__title">${title}</h2>
            </div>
        </div>
    `);

    const back = document.querySelector('.app-touch-back');

    if (el === 'menu') back.classList.add(el);
};

const slider = (restaurantObject, move, noScroll = undefined) => {
    if (noScroll === undefined) {
        restaurantObject.item.forEach(function(item, ind) {
            if (ind == restaurantObject.position) {    
                const img = item.querySelector('img');
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    setTimeout(() => img.classList.add('active'), appSettings.sliderDelay);
                }
            }
        });
    } else {
        noScroll.classList.add('overflow');
        setTimeout(() => noScroll.classList.remove('overflow'), appSettings.noScroll);
    
        if (move === 'next') restaurantObject.position = (restaurantObject.position < restaurantObject.itemsCount - 1) ? restaurantObject.position + 1 : restaurantObject.itemsCount - 1;
        if (move === 'prev') restaurantObject.position = (restaurantObject.position > restaurantObject.itemsCount - restaurantObject.itemsCount) ? restaurantObject.position - 1 : restaurantObject.itemsCount - restaurantObject.itemsCount;

        restaurantObject.track.style.transform = `translateX(${-restaurantObject.movePosition * restaurantObject.position}px)`;
        restaurantObject.dots.forEach(function(dot) {
            dot.classList.remove('active');
            if (dot.dataset.dot == restaurantObject.position) dot.classList.add('active');
        });
    
        restaurantObject.item.forEach(function(item, ind) {
            if (ind == restaurantObject.position) {
                restaurantObject.seeMenu.dataset.menures = item.dataset.menu;
                restaurantObject.seeMenu.dataset.nameres = item.dataset.name;
    
                const img = item.querySelector('img');
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.setAttribute('data-src', '');
                    setTimeout(() => img.classList.add('active'), appSettings.lazyLoadingImgDelay);
                }
            }
        });
    }
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

const createGoodsInMain = (good, createGoods) => {
    const {
        id, name, nameMin, img, ingredients: ing, category, time, main
    } = good;

    const goodCode = `
        <div class="good good_in-main" data-name="${name}" data-ingredients="${ing}" data-img="${img}" data-time="${time}">
            <div class="good__content">
                <div class="good__wrap">
                    <div class="good__wrap-img">
                        <img data-src="${img}" src="${appSettings.lazyLoadingImg}" alt="good-img-${id}" class="good__img">
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
        createGoods.insertAdjacentHTML(appSettings.positionElements.beforeend, goodCode);
    }
};
const createRestaurantsInMain = (restaurant, createRestaurants, createDots) => {
    const {
        id, index, name, img, menu, address, link
    } = restaurant;
    
    const itemRestaurant = document.createElement('div');
    itemRestaurant.className = 'restaurants__slider-item';
    itemRestaurant.setAttribute('id', id);
    itemRestaurant.setAttribute('data-menu', menu);
    itemRestaurant.setAttribute('data-name', name);

    const dots = document.createElement('span');
    dots.className = 'restaurants__slider-dot';
    dots.setAttribute('data-dot', index);

    itemRestaurant.insertAdjacentHTML(appSettings.positionElements.beforeend, `
        <div class="restaurants__slider-item-content">
            <div class="restaurants__slider-item-wrap-img">
                <img data-src="${img}" src="${appSettings.lazyLoadingImg}" alt="" class="restaurants__slider-item-img">
            </div>
            <div class="restaurants__slider-item-wrap-text">
                <div class="restaurants__slider-item-name">${name}</div>
                <div class="restaurants__slider-item-address">
                    <a href="${link}">${address}</a>
                </div>
            </div>
        </div>
    `);

    if (id === 'kveli' || id === 'prougli') itemRestaurant.children[0].children[0].style.border = '.05rem solid #f2f2f2';
    if (index == 0) dots.classList.add('active');

    createRestaurants.insertAdjacentElement(appSettings.positionElements.beforeend, itemRestaurant);
    createDots.insertAdjacentElement(appSettings.positionElements.beforeend, dots);
};

const goodsCreateContent = (touchGood, back) => {
    const goodsScroll = document.querySelector('.app-touch-good__scroll');

    back(goodsScroll, appContent.back.goods);

    goodsScroll.insertAdjacentHTML(appSettings.positionElements.beforeend, `
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
                goodsCategories.insertAdjacentHTML(appSettings.positionElements.beforeend, `<div class="app-touch-good__categories-el active" data-filter="${category.name}">
                    <span>${category.name}</span>
                </div>`);   
            } else {
                goodsCategories.insertAdjacentHTML(appSettings.positionElements.beforeend, `<div class="app-touch-good__categories-el" data-filter="${category.name}">
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

            goodsGoods.insertAdjacentHTML(appSettings.positionElements.beforeend, `
                <div class="good good_in-goods" data-filter="${category}" data-name="${name}" data-ingredients="${ing}" data-img="${img}" data-time="${time}">
                    <div class="good__content">
                        <div class="good__wrap">
                            <div class="good__wrap-img">
                                <img data-src="${img}" src="${appSettings.lazyLoadingImg}" alt="good-img-${id}" class="good__img good__img_src">
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
        lazyLoadingImg(goodsScroll, '.good_in-goods');
    });  

    touchGood.addEventListener('click', function(event) {
        const category = event.target.closest('.app-touch-good__categories-el');
        const back = event.target.closest('.app-touch-back__icon');

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
                
                if (good.dataset.filter !== undefined) {
                    const goodDataFilter = good.dataset.filter.split(', ');
                    
                    for (const el of goodDataFilter) {
                        if (el === dataFilter || dataFilter === "все") {
                            good.classList.add('show');
                            good.classList.remove('hide');
                        }
                    }
                }
            }
            lazyLoadingImg(goodsScroll, '.good_in-goods');
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
        form.fromIngredients.insertAdjacentHTML(appSettings.positionElements.beforeend, `
            <div class="form__ingredient-el">
                <span class="form__ingredient-chec"></span>
                <span class="form__ingredient-name">${ingredient}</span>
            </div>
        `);
    };
    form.fromIngredients.insertAdjacentHTML(appSettings.positionElements.beforeend, `
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

const watchMenu = (menu, touchWatchMenu, back) => {
    const watchMenuScroll = document.querySelector('.app-touch-watch-menu__scroll');

    const restaurantName = menu.dataset.nameres;
    const restaurantMenu = menu.dataset.menures.split(', ');

    back(watchMenuScroll, restaurantName, 'menu');

    watchMenuScroll.insertAdjacentHTML(appSettings.positionElements.beforeend, `
        <div class="app-touch-watch-menu__wrap-items"></div> 
    `);

    const watchMenuWrapItems = document.querySelector('.app-touch-watch-menu__wrap-items');

    for (const menu of restaurantMenu) {
        watchMenuWrapItems.insertAdjacentHTML(appSettings.positionElements.beforeend, `
            <div class="item">
                <div class="item__wrap">
                    <div class="item__wrap-img">
                        <img class="item__img open-img" data-src="${menu}" src="${appSettings.lazyLoadingImg}" alt="">
                    </div>
                    <div class="item__pepper"></div>
                </div>
            </div>
        `);
    }

    lazyLoadingImg(watchMenuScroll, '.item');

    touchWatchMenu.addEventListener('click', function(event) {
        const back = event.target.closest('.app-touch-back__icon');
        
        if (back) {
            this.classList.remove('active');
            watchMenuScroll.textContent = '';
        }
    })
};

const initialization = (appObject, restaurantObject, goodsCreateContent, back, slider, formObj, openForm, closeForm, watchMenu) => {

    appObject.touch.addEventListener('click', function(event) {
        const good = event.target.closest('.good');

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

            openForm(formObj, goodName, goodCleanName, goodIngredients, goodImg, goodTime);
        } else return;
    });

    appObject.sectionGoodsInMain.addEventListener('click', function(event) {
        const seeAll = event.target.closest('#see-all-goods');
        
        if (seeAll) {
            appObject.touchGood.classList.add('active');
            setTimeout(() => goodsCreateContent(appObject.touchGood, back), 100);
        } else return;
    });

    // нужно написать свой свайп. этот работает не так, как мне нужно
    restaurantObject.slider.addEventListener('swiped-left', function(event) { 
        slider(restaurantObject, 'next', appObject.mainScroll);
    });
    // нужно написать свой свайп. этот работает не так, как мне нужно
    restaurantObject.slider.addEventListener('swiped-right', function() {
        slider(restaurantObject, 'prev', appObject.mainScroll);
    });
    restaurantObject.restaurants.addEventListener('click', function(event) {
        const dot = event.target.closest('.restaurants__slider-dot');
        const seeMenu = event.target.closest('#see-menu');
        const restaurant = event.target.closest('.restaurants__slider-item-wrap-img');

        const dots = document.querySelectorAll('.restaurants__slider-dot');
        const menu = document.getElementById('see-menu');
        
        if (dot) {
            for (const dot of dots) {
                dot.classList.remove('active');
            }

            const ind = Number(dot.dataset.dot);
            restaurantObject.position = ind;

            dot.classList.add('active');
            restaurantObject.track.style.transform = `translateX(${-restaurantObject.movePosition * restaurantObject.position}px)`;

            restaurantObject.item.forEach(function(item, ind) {
                if (ind == restaurantObject.position) {
                    restaurantObject.seeMenu.dataset.menures = item.dataset.menu;
                    restaurantObject.seeMenu.dataset.nameres = item.dataset.name
                }
            });
        }

        if (seeMenu || restaurant) {
            appObject.touchWatchMenu.classList.add('active');
            setTimeout(() => watchMenu(menu, appObject.touchWatchMenu, back), 100);
        }
    });

    formObj.formClose.addEventListener('click', function(event) {
        if (this.nextElementSibling.classList.contains('active')) closeForm(formObj);
        else return;
    });
    formObj.formWrapForm.addEventListener('swiped-down', function(event) {
        closeForm(formObj);
    });
};

const appTouch = (
    back,
    slider,
    createElements,
    createGoodsInMain,
    createRestaurantsInMain,
    goodsCreateContent,
    init,
    openForm,
    closeForm,
    watchMenu   
) => {
    app.classList.add('app_TOUCH');

    const appTouch = createElements(app, 'div', 'app-touch', appSettings.positionElements.beforeend);
    const appTouchMain = createElements(appTouch, 'main', 'app-touch-main', appSettings.positionElements.beforeend);
    const appTouchGoods = createElements(appTouch, 'div', 'app-touch-good', appSettings.positionElements.beforeend);
    const appTouchForm = createElements(appTouch, 'div', 'app-touch-form', appSettings.positionElements.beforeend);
    const appTouchWatchMenu = createElements(appTouch, 'div', 'app-touch-watch-menu', appSettings.positionElements.beforeend);
    
    appTouchMain.insertAdjacentHTML(appSettings.positionElements.beforeend, `
        <div class="app-touch-main__scroll">
            <section class="app-touch-main__section app-touch-main__section_welcome">
                <div class="app-touch-main__welcome">
                    <div class="app-touch-main__welcome-slider welcome-slider">
                        <div class="welcome-slider__item lazy">
                            <div class="welcome-slider__wrap-img">
                                <img data-src="${appSettings.imgWelcome}" src="${appSettings.lazyLoadingImg}" alt="welcome4">
                            </div>
                        </div>
                    </div>
                    <div class="app-touch-main__welcome-content">
                        <h1 class="app-touch-title app-touch-title_welcome">${appContent.main.welcome.title}</h1>
                        <div class="app-touch-descr app-touch-descr_welcome">${appContent.main.welcome.descr}</div>
                    </div>
                </div>
            </section>
            <section class="app-touch-main__section app-touch-main__section_goods">
                <h2 class="app-touch-title app-touch-title_goods">${appContent.main.goods.title}</h2>
                <div class="app-touch-main__goods goods">
                    <div class="see-el">
                        <span id="see-all-goods">${appContent.main.goods.seeAll.text}</span>
                    </div>
                    <div class="goods__wrap-scroll">
                        <div id="create-goods-in-main" class="goods__scroll after"></div>
                    </div>
                </div>
            </section>
            <section class="app-touch-main__section app-touch-main__section_restaurants">
                <h2 class="app-touch-title app-touch-title_restaurants">${appContent.main.restaurants.title}</h2>
                <div class="app-touch-main__restaurants restaurants">
                    <div class="see-el">
                        <span id="see-menu" data-nameres="" data-menures="">${appContent.main.restaurants.seeMenu.text}</span>
                    </div>
                    <div class="restaurants__slider">
                        <div id="create-restaurant-in-main" class="restaurants__slider-track"></div>
                        <div id="create-dots-restaurant-in-main" class="restaurants__slider-dots"></div>
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

    appTouchWatchMenu.insertAdjacentHTML(appSettings.positionElements.beforeend, `<div class="app-touch-watch-menu__scroll"></div>`);

    const appObject = {
        touch: appTouch,
        touchGood: appTouchGoods,
        touchWatchMenu: appTouchWatchMenu,
        mainScroll: document.querySelector('.app-touch-main__scroll'),
        sectionGoodsInMain: document.querySelector('.app-touch-main__section_goods'),
        createGoodsInMain: document.getElementById('create-goods-in-main'),
        createRestaurantsInMain: document.getElementById('create-restaurant-in-main'),
        createDotsInMain: document.getElementById('create-dots-restaurant-in-main')
    }

    const restaurantObject = {
        restaurants: document.querySelector('.restaurants'),
        slider: document.querySelector('.restaurants__slider'),
        track: document.querySelector('.restaurants__slider-track'),
        seeMenu: document.getElementById('see-menu'),
        position: appSettings.sliders.position,
        slidesToScroll: appSettings.sliders.slidesToScroll
    };

    const formObj = {
        appTouchForm: appTouchForm,
        formGood: document.querySelector('.form__good'),
        formClose: appTouchForm.children[0],
        formWrapForm: appTouchForm.children[1],
        form: document.getElementById('form'),
        formNameS: document.querySelector('.form__name-submit'),
        fromIngredientsS: document.querySelector('.form__ingredients-submit'),
        fromIngredients: document.querySelector('.form__ingredients'),
    }

    appGetData('./db/goods.json', appObject.createGoodsInMain).then(data => {
        data.forEach(good => createGoodsInMain(good, appObject.createGoodsInMain));

        console.log(':: In main', appObject.createGoodsInMain.children.length, 'elmenets');
        lazyLoadingImg(appObject.createGoodsInMain, '.good_in-main', 'x');
    });

    appGetData('./db/restaurants.json').then(data => {
        data.forEach(restaurant => createRestaurantsInMain(restaurant, appObject.createRestaurantsInMain, appObject.createDotsInMain));

        restaurantObject['item'] = document.querySelectorAll('.restaurants__slider-item');
        restaurantObject['itemsCount'] = restaurantObject.item.length;
        restaurantObject['dots'] = document.querySelectorAll('.restaurants__slider-dot');
        restaurantObject['movePosition'] = restaurantObject.slidesToScroll * restaurantObject.slider.clientWidth + 16;

        restaurantObject.item.forEach(function(item, ind) {
            if (ind == restaurantObject.position) {
                restaurantObject.seeMenu.dataset.menures = item.dataset.menu;
                restaurantObject.seeMenu.dataset.nameres = item.dataset.name
            }
        });

        slider(restaurantObject);
    });

    lazyLoadingImg(appObject.mainScroll, '.lazy');

    init(appObject, restaurantObject, goodsCreateContent, back, slider, formObj, openForm, closeForm, watchMenu);
};
const appDesktop = () => app.classList.add('app_DESKTOP');

if (touchScreen) appTouch(
    appBack,
    slider,
    appCreateElements,
    createGoodsInMain,
    createRestaurantsInMain,
    goodsCreateContent,
    initialization,
    openForm,
    closeForm,
    watchMenu
);
else appDesktop();