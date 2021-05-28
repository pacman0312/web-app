const touchScreen = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const app = document.getElementById('app');

const windowWidth = document.documentElement.clientWidth;
const windowHeight = document.documentElement.clientHeight;
const breakpointWidth = 500;

const hideAppLog = '-- Hide app';
const showAppLog = '-- Show app';

const contentApp = {
    main: {
        goods: {
            title: 'Выбирай и готовь',
            seeAll: {
                text: 'смотреть все',
                icon: '&rarr;'
            },
            loading: 'images/loading.png',
            choose: 'Выбрать'
        }
    },
    back: {
        icon: 'images/icons/back.svg',
    },
    form: {
        timeText: 'время готвки:',
        title: 'Необходимые продукты',
        nothing: 'из продуктов все есть',
        submit: '#',
        submitBtnText: 'Отправить'
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
const lazyLoading = (elScroll, elImg, windowSize, page) => {
    const lazyLoadingImg = document.querySelectorAll(elImg);
    let lazyLoadingImgPositions = [];

    const lazy = el => {
        let indexImg = lazyLoadingImgPositions.findIndex(item => el > item - windowSize);
        
        if (indexImg >= 0) {
            let index = lazyLoadingImg[indexImg].dataset.src;

            if (index) {
                setTimeout(() => {
                    lazyLoadingImg[indexImg].classList.add('active');
                    lazyLoadingImg[indexImg].src = lazyLoadingImg[indexImg].dataset.src;
                    lazyLoadingImg[indexImg].removeAttribute('data-src');
                }, 200);
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
                    <img src="${contentApp.back.icon}" alt="iconBack">
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
        parent.classList.add('expectation');
    
        const response = await fetch(url);
    
        if (!response.ok) throw new Error(`in url: ${response.url} Status: ${response.status}`);
    
        setTimeout(() => {
            parent.classList.remove('expectation');
        }, 1000);
    
        return await response.json();
    }
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
            <section class="app-touch-main__section app-touch-main__section_goods">
                <h1 class="app-touch-title app-touch-title_goods">${content.goods.title}</h1>
                <div class="app-touch-main__goods goods">
                    <div class="goods__see-all">
                        <span id="see-all-goods">${content.goods.seeAll.text}</span>
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

    const elementCode = `<div class="app-touch-good__scroll"></div>`;
    
    element.insertAdjacentHTML(elPosition, elementCode);
    return element;
};
const createAppTouchForm = (app, createEl, el, elClass, elPosition, content) => {
    const element = createEl(app, el, elClass, elPosition);

    const elementCode = `
        <div class="app-touch-form__close"></div>
        <div class="app-touch-form__wrap-form">
            <div class="app-touch-form__swipe"></div>
            <form action="${content.submit}" id="form" class="form">
                <input class="form__name-submit" type="text" name="name" value="">
                <input class="form__ingredients-submit" type="text" name="ingredients" value="">
                <div class="form__good"></div>
                <div class="form__title">
                    <h2>${content.title}</h2>
                </div>
                <div class="form__ingredients"></div>
                <div class="form__btn">
                    <button class="form__btn-submit cursor-none" type="submit">${content.submitBtnText}</button>
                </div>
            </form>
        </div>
    `; 

    element.insertAdjacentHTML(elPosition, elementCode);
    return element;
};

const openForm = (appTF, fGood, fWrapForm, f, fNameS, fIngredientsS, fIngredients, fBtn, name, nameClean, ingredients, img, time, content) => {
    fNameS.setAttribute('value', nameClean);

    fGood.insertAdjacentHTML('beforeend', `
        <div class="form__good-img">
            <img src="${img}" alt="formGoodImg">
        </div>
        <div class="form__good-wrap">
            <div class="form__good-name">${name}</div>
            <div class="form__good-time">${content.timeText + ' ' + time}</div>
        </div>
    `);

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
        <div class="form__ingredient-el nothing">
            <span class="form__ingredient-chec"></span>
            <span class="form__ingredient-name">${content.nothing}</span>
        </div>
    `); 

    appTF.classList.add('active');
    setTimeout(() => {
        fWrapForm.classList.add('active');
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

                if (ingName === content.nothing) {
                    ingArr = [];

                    for (const ing2 of ingElements) {
                        ing2.classList.remove('active');
                    }
                    ingElementNothing.classList.add('active');

                    ingArr.push(ingElementNothing.children[1].textContent);
                } else {
                    ingElementNothing.classList.remove('active');

                    const ingredients = ingArr.find(item => item === content.nothing);
                    if (ingredients) ingArr.splice(ingArr.indexOf(ingredients), 1);

                    ingArr.push(ingName);
                };
            } else {
                ing.classList.remove('active');
                
                if (ingName === content.nothing) {
                    ingArr = [];
                } else {
                    const ingredients = ingArr.find(item => item === ingName);
                    if (ingredients) ingArr.splice(ingArr.indexOf(ingredients), 1);
                };
            };
            
            fIngredientsS.setAttribute('value', ingArr.join(', '));
        });
    };

    f.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Этот функционал находится в разработке');
    });

    // f.addEventListener('submit', async function(event) {
    //     event.preventDefault();
        
    //     let formData = new FormData(f);
    //     console.log(formData);
    //     let response = await fetch('./php/telegram.php', {
    //         method: 'POST',
    //         body: formData
    //     });

    //     if (response.ok) {
    //         let result = await response.json();
    //         alert(result.message);
    //         form.reset();
    //     } else {
    //         console.log('Error');
    //     }
    // });
};
const closeForm = (appTF, fGood, fWrapForm, fNameS, fIngredientsS, fIngredients) => {
    fWrapForm.classList.remove('active');

    setTimeout(() => {
        appTF.classList.remove('active');
        
        setTimeout(() => {
            fNameS.setAttribute('value', '');
            fIngredientsS.setAttribute('value', '');
            fGood.textContent = '';
            fIngredients.textContent = '';
        }, 100);
    }, 300);
};

const goodsCreateContent = (appTG, back) => {
    appTG.classList.add('active');

    const goodsScroll = document.querySelector('.app-touch-good__scroll');

    back(goodsScroll, 'Выбирай и готовь!');

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
                        <div class="good__wrap-img">
                            <img data-src="${img}" src="${contentApp.main.goods.loading}" alt="good-img-${id}" class="good__img">
                            <span class="good__time">${time}</span>
                        </div>
                        <div class="good__wrap-text">
                            <div class="good__name">${name}</div>
                            <div class="good__choose">${contentApp.main.goods.choose}</div>
                        </div>
                    </div>
                </div>
            `);            
        });
        lazyLoading(goodsScroll, 'img[data-src]', windowHeight, 'y');
    });  
    
    goodsCategories.addEventListener('click', function(event) {
        const target = event.target;
        const category = target.closest('.app-touch-good__categories-el');

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
            lazyLoading(goodsScroll, 'img[data-src]', windowHeight, 'y');
        }
    }, false);

    appTG.addEventListener('click', function(event) {
        const target = event.target;
        const back = target.closest('.app-touch-back');

        if (back) {
            this.classList.remove('active');
            goodsScroll.textContent = '';
        };

    }, false);
};  

const appLog = (t, tm, tg, tf) => {
    console.log(t);
    console.log(tm);
    console.log(tg);
    console.log(tf);
};

const appTouch = (
    resize,
    back,
    cElements,
    cAppTouch,
    cAppTouchMain,
    cAppTouchGoods,
    cAppTouchForm,
    openForm,
    closeForm,
) => {
    resize(hideApp, showApp);

    const appTouch = cAppTouch(app, cElements, 'div', 'app-touch', 'beforeend');
    const appTouchMain = cAppTouchMain(appTouch, cElements, 'main', 'app-touch-main', 'beforeend', contentApp.main);
    const appTouchGood = cAppTouchGoods(appTouch, cElements, 'div', 'app-touch-good', 'beforeend');
    const appTouchForm = cAppTouchForm(appTouch, cElements, 'div', 'app-touch-form', 'beforeend', contentApp.form);

    const goodsCreateInMainTouch = document.querySelector('.goods__scroll');
    const goodsSectionInMainTouch = document.querySelector('.app-touch-main__section_goods');
    
    const formGood = document.querySelector('.form__good');
    const formClose = appTouchForm.children[0];
    const formWrapForm = appTouchForm.children[1];
    // const formSwipe = formWrapForm.children[0];
    const formSwipe = formWrapForm;
    const form = document.getElementById('form');
    const formNameS = document.querySelector('.form__name-submit');
    const fromIngredientsS = document.querySelector('.form__ingredients-submit');
    const fromIngredients = document.querySelector('.form__ingredients');
    const formBtn = document.querySelector('.form__btn-submit');
    let formSwipeX = null;
    let formSwipeY = null;

    appLog(appTouch, appTouchMain, appTouchGood, appTouchForm);

    appGetData('./db/goods.json', goodsCreateInMainTouch).then(data => {
        data.forEach(good => {
            const {
                id, name, nameMin, img, ingredients: ing, category, time, main
            } = good;

            const goodCode = `
                <div class="good" data-name="${name}" data-ingredients="${ing}" data-img="${img}" data-time="${time}">
                    <div class="good__content">
                        <div class="good__wrap-img">
                            <img data-src="${img}" src="${contentApp.main.goods.loading}" alt="good-img-${id}" class="good__img">
                            <span class="good__time">${time}</span>
                        </div>
                        <div class="good__wrap-text">
                            <div class="good__name">${name}</div>
                            <div class="good__choose">${contentApp.main.goods.choose}</div>
                        </div>
                    </div>
                </div>
            `;

            if (main !== '') {
                goodsCreateInMainTouch.insertAdjacentHTML('beforeend', goodCode);
            }
        });

        console.log(':: In main', goodsCreateInMainTouch.children.length, 'elmenets');
        lazyLoading(goodsCreateInMainTouch, 'img[data-src]', windowWidth, 'x');
    });

    goodsSectionInMainTouch.addEventListener('click', function(event) {
        const target = event.target;
        const sesAll = target.closest('#see-all-goods');
        if (sesAll) goodsCreateContent(appTouchGood, back);
    }, false);

    appTouch.addEventListener('click', function(event) {
        const target = event.target;
        const good = target.closest('.good');

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

            openForm(appTouchForm, formGood, formWrapForm, form, formNameS, fromIngredientsS, fromIngredients, formBtn, goodName, goodCleanName, goodIngredients, goodImg, goodTime, contentApp.form);
        };
    });



    formClose.addEventListener('click', function() {
        if (this.nextElementSibling.classList.contains('active')) closeForm(appTouchForm, formGood, formWrapForm, formNameS, fromIngredientsS, fromIngredients);
        else return false;
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
            if (formSwipeYDiff > 100) {
                formWrapForm.classList.add('swipe');
                setTimeout(() => {
                    formWrapForm.classList.remove('swipe');
                }, 100);

                if (formSwipeYDiff > 300) {
                    formWrapForm.classList.remove('swipe');
                    closeForm(appTouchForm, formGood, formWrapForm, formNameS, fromIngredientsS, fromIngredients);
                }
            }
            return false; 
        }
    }, false);

    window.addEventListener('resize', function(windowWidth) {
        windowWidth = document.documentElement.clientWidth;

        if (windowWidth > breakpointWidth) hideApp();
        else showApp();
    });
};
const appDesktop = () => console.log('desktop');

if (touchScreen) {
    appTouch(
        resizeApp,
        appBack,
        createElements,
        createAppTouch,
        createAppTouchMain,
        createAppTouchGoods,
        createAppTouchForm,
        openForm,
        closeForm,
    );
} else appDesktop()