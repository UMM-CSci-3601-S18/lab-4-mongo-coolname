/*
import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TodoPage {
    navigateTo(): promise.Promise<any> {
        return browser.get('/todos');
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        const title = element(by.id('todo-list-title')).getText();
        this.highlightElement(by.id('todo-list-title'));

        return title;
    }

    typeAOwner(name: string) {
        const input = element(by.id('ownerName'));
        input.click();
        input.sendKeys(name);
    }

    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    getBody(company: string) {
        const input = element(by.id('todoBody'));
        input.click();
        input.sendKeys(company);
        const selectButton = element(by.id('submit'));
        selectButton.click();
    }

    getTodoByStatus(owner:string) {
        const input = element(by.id('todoStatus'));
        input.click();
        input.sendKeys(owner);
        input.click();
    }

    getUniqueTodo(_id: string) {
        const todo = element(by.id(_id)).getText();
        this.highlightElement(by.id(_id));

        return todo;
    }

    getTodos() {
        return element.all(by.className('todos'));
    }

    clickClearBodySearch() {
        const input = element(by.id('bodyClearSearch'));
        input.click();
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).isPresent();
    }

    clickAddUserButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).click();
    }

}
*/
import {browser, by, element, Key} from 'protractor';

export class TodoPage {
    navigateTo() {
        return browser.get('/todos');
    }

    //http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return "highlighted";
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        let title = element(by.id('todo-list-title')).getText();
        this.highlightElement(by.id('todo-list-title'));

        return title;
    }

    typeAnId(_id: string) {
        let input = element(by.id('todoId'));
        input.click();
        input.sendKeys(_id);
    }

    typeACategory(category: string) {
        let input = element(by.id('todoCategory'));
        input.click();
        input.sendKeys(category);
    }

    typeAnOwner(owner: string) {
        let input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(owner);
    }

    typeAStatus(status: string) {
        let input = element(by.id('todoStatus'));
        input.click();
        input.sendKeys(status);
        input.click();
    }

    typeABody(body: string) {
        let input = element(by.id('todoBody'));
        input.click();
        input.sendKeys(body);
    }


    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    selectDownKey(){
        browser.actions().sendKeys(Key.ARROW_DOWN).perform();
    }

    getTodoByStatus() {
        let input = element(by.id('todoStatus'));
        input.click();
    }

    backspace(){
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }


    getUniqueTodo(_id:string) {
        let todo = element(by.id(_id)).getText();
        this.highlightElement(by.id(_id));

        return todo;
    }
}
