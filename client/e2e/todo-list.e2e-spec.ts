import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

describe('Todo list', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });

    it('should get and highlight Todos title attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Todos');
    });

    it('should type something in filter name box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeAOwner('Blanche');
        expect(page.getUniqueTodo('58af3a600343927e48e87212')).toEqual('Blanche');
        page.backspace();
        page.typeAOwner('Fry');
        expect(page.getUniqueTodo('58af3a600343927e48e87217')).toEqual('Fry');
    });

    it('should click on the status 27 times and return 3 elements then ', () => {
        page.navigateTo();
        page.getTodoByStatus();
        for (let i = 0; i < 27; i++) {
            page.selectUpKey();
        }

        expect(page.getUniqueTodo('software design')).toEqual('Blanche');

        expect(page.getUniqueTodo('video games')).toEqual('Barry');
    });

    it('Should open the expansion panel and get the body', () => {
        page.navigateTo();
        page.getBody('Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.');
        browser.actions().sendKeys(Key.ENTER).perform();

        expect(page.getUniqueTodo('software design')).toEqual('Blanche');

        // This is just to show that the panels can be opened
        browser.actions().sendKeys(Key.TAB).perform();
        browser.actions().sendKeys(Key.ENTER).perform();
    });

    it('Should allow us to filter todos based on body', () => {
        page.navigateTo();
        page.getBody('Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(1);
        });
        expect(page.getUniqueTodo('software design')).toEqual('Connie Stewart');
        expect(page.getUniqueTodo('stokesclayton@momentia.com')).toEqual('Stokes Clayton');
        expect(page.getUniqueTodo('kittypage@surelogic.com')).toEqual('Kitty Page');
        expect(page.getUniqueTodo('margueritenorton@recognia.com')).toEqual('Marguerite Norton');
    });

    it('Should allow us to clear a search for company and then still successfully search again', () => {
        page.navigateTo();
        page.getBody('m');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(2);
        });
        page.clickClearBodySearch();
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(10);
        });
        page.getBody('ne');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(3);
        });
    });

    it('Should allow us to search for company, update that search string, and then still successfully search', () => {
        page.navigateTo();
        page.getBody('o');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(4);
        });
        element(by.id('userBody')).sendKeys('h');
        element(by.id('submit')).click();
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(1);
        });
    });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

    it('Should have an add todo button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add todo button is clicked', () => {
        page.navigateTo();
        expect(element(by.css('add-todo')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.id('addNewTodo')).click();
        expect(element(by.css('add-todo')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually add the todo with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddUserButton();
        element(by.id('ownerField')).sendKeys('Abe');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('statusField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
            element(by.id('statusField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                element(by.id('statusField')).sendKeys('true');
            });
        });
        element(by.id('bodyField')).sendKeys('Veniam ut ex sit voluptate Lorem. Laboris ipsum nulla proident aute culpa esse aute pariatur velit deserunt deserunt cillum officia dolore.');
        element(by.id('categoryField')).sendKeys('homework');
        element(by.id('confirmAddTodoButton')).click();
        // This annoying delay is necessary, otherwise it's possible that we execute the `expect`
        // line before the add todo has been fully processed and the new todo is available
        // in the list.
        setTimeout(() => {
            expect(page.getUniqueTodo('homework')).toMatch('Abe'); // toEqual('Tracy Kim');
        }, 10000);
    });

    it('Should allow us to put information into the fields of the add todo dialog', () => {
        page.navigateTo();
        page.clickAddUserButton();
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be a owner field');
        element(by.id('ownerField')).sendKeys('Dana Jones');
        expect(element(by.id('statusField')).isPresent()).toBeTruthy('There should be an status field');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('statusField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
            element(by.id('statusField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                element(by.id('statusField')).sendKeys('true');
            });
        });
        expect(element(by.id('bodyField')).isPresent()).toBeTruthy('There should be a body field');
        element(by.id('bodyField')).sendKeys('Awesome Startup, LLC');
        expect(element(by.id('categoryField')).isPresent()).toBeTruthy('There should be an category field');
        element(by.id('categoryField')).sendKeys('homework');
        element(by.id('exitWithoutAddingButton')).click();
    });
});
