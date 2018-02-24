import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";
import {Observable} from "rxjs";
import {MatDialog} from '@angular/material';
import {AddTodoComponent} from "./add-todo.component"

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[];

    public todoOwner : string;
    public todoID : string;
    public todoStatus : string;
    public todoBody : string;
    public todoCategory : string;

    public loadReady: boolean = false;

    //Inject the TodoListService into this component.
    //That's what happens in the following constructor.
    //panelOpenState: boolean = false;
    //We can call upon the service for interacting
    //with the server.
    constructor(public todoListService: TodoListService, public dialog: MatDialog) {

    }

    openDialog(): void {
        let dialogRef = this.dialog.open(AddTodoComponent, {
            width: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }


    public filterTodos(searchOwner: string, searchStatus: string, searchBody: string): Todo[] {

        this.filteredTodos = this.todos;

        //Filter by owner
        if (searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchOwner || todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
            });
        }

        //Filter by status
        if (searchStatus != null) {
            searchStatus = searchStatus.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchStatus || String(todo.status).toLowerCase().indexOf(searchStatus) !== -1;
            });
        }

        //Filter by body
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
            });
        }

        return this.filteredTodos;
    }

    /**
     * Starts an asynchronous operation to update the todos list
     *
     */
    refreshTodos(): Observable<Todo[]> {
        //Get Todos returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)
        console.log("in refreshTodos");
        let todos : Observable<Todo[]> = this.todoListService.getTodos();
        todos.subscribe(
            todos => {
                console.log("First todo in refresh is " + JSON.stringify(todos[0]));
                this.todos = todos;
                this.filterTodos(this.todoOwner, this.todoStatus, this.todoBody);
            },
            err => {
                console.log(err);
            });
        return todos;
    }


    loadService(): void {
        console.log('in loadService');
        this.loadReady = true;
        this.todoListService.getTodos(this.todoID).subscribe(
            todos => {
                console.log("First todo in loadService is " + JSON.stringify(todos[0]));
                this.todos = todos;
                this.filteredTodos = this.todos;
            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.refreshTodos();
        this.loadService();
    }
}
