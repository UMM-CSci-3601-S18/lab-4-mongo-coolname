import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";
import {Observable} from "rxjs/Observable";
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


    //Inject the TodoListService into this component.
    //That's what happens in the following constructor.
    //panelOpenState: boolean = false;
    //We can call upon the service for interacting
    //with the server.

    private highlightedID: {'$oid': string} = { '$oid': '' };
    constructor(public todoListService: TodoListService, public dialog: MatDialog) {

    }

    isHighlighted(todo: Todo): boolean {
        return todo._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newTodo: Todo = {_id: '', owner: '', status: true, body: '', category: ''};
        const dialogRef = this.dialog.open(AddTodoComponent, {
            width: '500px',
            data: { todo: newTodo }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.todoListService.addNewTodo(result).subscribe(
                result => {
                    this.highlightedID = result;
                    this.refreshTodos();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the todo.');
                    console.log('todoThe error was ' + JSON.stringify(err));
                });
        });
    }


    public filterTodos(searchOwner: string, searchID: string, searchStatus: string, searchBody: string, searchCategory: string): Todo[] {

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

        return this.filteredTodos;
    }

    /**
     * Starts an asynchronous operation to update the todos list
     *
     */
    refreshTodos(): Observable<Todo[]> {
        //Get Todos returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)
        let todos : Observable<Todo[]> = this.todoListService.getTodos();
        todos.subscribe(
            todos => {
                this.todos = todos;
                this.filterTodos(this.todoOwner, this.todoStatus, this.todoID, this.todoBody, this.todoCategory);
            },
            err => {
                console.log(err);
            });
        return todos;
    }


    loadService(): void {
        this.todoListService.getTodos(this.todoBody,this.todoCategory).subscribe(
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
    setTitle(owner, category):string{
        if(this.todoOwner != null){
            return category;
        }
        return owner;
    }

    convertStatus(status):string{
        if(status === true){
            return "Complete"
        }
        return "Incomplete"
    }

    setStatus(status):string{
        if(status == true) {
            return "✓";
        }
        return "✗";
    }



    ngOnInit(): void {
        this.refreshTodos();
        this.loadService();
    }
}
