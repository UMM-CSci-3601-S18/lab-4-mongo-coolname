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
                    _id: "58af3a600343927e48e87212",
                    owner: "Blanche",
                    status: true,
                    body: "Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.",
                    category: "software design"
                },
                {
                    _id: "58af3a600343927e48e87217",
                    owner: "Fry",
                    status: false,
                    body: "Veniam ut ex sit voluptate Lorem. Laboris ipsum nulla proident aute culpa esse aute pariatur velit deserunt deserunt cillum officia dolore.",
                    category: "homework"
                },
                {
                    _id: "58af3a600343927e48e87214",
                    owner: "Barry",
                    status: true,
                    body: "Nisi sit non non sunt veniam pariatur. Elit reprehenderit aliqua consectetur est dolor officia et adipisicing elit officia nisi elit enim nisi.",
                    category: "video games"
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

    it("contains a todo owner 'Blanche'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Blanche")).toBe(true);
    });

    it("contain a todo owner 'Fry'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Fry")).toBe(true);
    });

    it("doesn't contain a todo owner 'Barry'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Barry")).toBe(true);
    });

    it("has two todos that are true", () => {
        expect(todoList.todos.filter((todo: Todo) => todo.status === true).length).toBe(2);
    });

    it("todo list filters by owner", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoOwner = "f";
        let a : Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(todoList.filteredTodos.length).toBe(1);
            });
    });

    it("todo list filters by status", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoStatus = "true";
        let a : Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(todoList.filteredTodos.length).toBe(3);
            });
    });

    it("todo list filters by owner and status", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoStatus = "true";
        todoList.todoOwner = "b";
        let a : Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(todoList.filteredTodos.length).toBe(2);
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
