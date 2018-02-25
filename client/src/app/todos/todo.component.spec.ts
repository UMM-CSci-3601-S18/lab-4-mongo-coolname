import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Todo} from "./todo";
import {TodoComponent} from "./todo.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs";
//import { PipeModule } from "../../pipe.module";

describe("Todo component", () => {

    let todoComponent: TodoComponent;
    let fixture: ComponentFixture<TodoComponent>;

    let todoListServiceStub: {
        getTodoById: (todoId: string) => Observable<Todo>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodoById: (todoId: string) => Observable.of([
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
            ].find(todo => todo._id === todoId))
        };

        TestBed.configureTestingModule({
            //imports: [PipeModule],
            declarations: [TodoComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoComponent);
            todoComponent = fixture.componentInstance;
        });
    }));

    it("can retrieve Blanche by ID", () => {
        todoComponent.setId("58af3a600343927e48e87212");
        expect(todoComponent.todo).toBeDefined();
        expect(todoComponent.todo.owner).toBe("Blanche");
        expect(todoComponent.todo.category).toBe("software design");
    });

    it("returns undefined for Fry", () => {
        todoComponent.setId("Fry");
        expect(todoComponent.todo).not.toBeDefined();
    });

});
