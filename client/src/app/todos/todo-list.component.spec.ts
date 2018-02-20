import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Todo} from "./todo";
import {TodoListComponent} from "./todo-list.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs";
import {FormsModule} from "@angular/forms";
import {CustomModule} from "../custom.module";
import {MATERIAL_COMPATIBILITY_MODE} from "@angular/material";


describe("Todo list", () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id: "chris_id",
                    owner: "Chris",
                    status: 25,
                    body: "UMM",
                    category: "chris@this.that"
                },
                {
                    _id: "pat_id",
                    owner: "Pat",
                    status: 37,
                    body: "IBM",
                    category: "pat@something.com"
                },
                {
                    _id: "jamie_id",
                    owner: "Jamie",
                    status: 37,
                    body: "Frogs, Inc.",
                    category: "jamie@frogs.com"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("contains all the todos", () => {
        expect(todoList.todos.length).toBe(3);
    });

    it("contains a todo ownerd 'Chris'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Chris")).toBe(true);
    });

    it("contain a todo ownerd 'Jamie'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Jamie")).toBe(true);
    });

    it("doesn't contain a todo ownerd 'Santa'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Santa")).toBe(false);
    });

    it("has two todos that are 37 years old", () => {
        expect(todoList.todos.filter((todo: Todo) => todo.status === 37).length).toBe(2);
    });

    it("todo list filters by owner", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoName = "a";
        let a : Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(todoList.filteredTodos.length).toBe(2);
            });
    });

    it("todo list filters by status", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoAge = 37;
        let a : Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(todoList.filteredTodos.length).toBe(2);
            });
    });

    it("todo list filters by owner and status", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoAge = 37;
        todoList.todoName = "i";
        let a : Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(todoList.filteredTodos.length).toBe(1);
            });
    });

});

describe("Misbehaving Todo List", () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.create(observer => {
                observer.error("Error-prone observable");
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("generates an error if we don't set up a TodoListService", () => {
        // Since the observer throws an error, we don't expect todos to be defined.
        expect(todoList.todos).toBeUndefined();
    });
});
