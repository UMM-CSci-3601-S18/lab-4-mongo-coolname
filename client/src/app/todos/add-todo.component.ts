import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";


@Component({
    selector: 'add-todo.component',
    templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent {
    public newTodoOwner:string;
    public newTodoStatus: number;
    public newTodoBody: string;
    public newTodoCategory: string;
    private todoAddSuccess : Boolean = false;

    public todos: Todo[];

    constructor(public todoListService: TodoListService,
        public dialogRef: MatDialogRef<AddTodoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addNewTodo(owner: string, status: number, body : string, category : string) : void{

        //Here we clear all the fields, there's probably a better way
        //of doing this could be with forms or something else
        this.newTodoOwner = null;
        this.newTodoStatus = null;
        this.newTodoBody = null;
        this.newTodoCategory = null;

        this.todoListService.addNewTodo(owner, status, body, category).subscribe(
            succeeded => {
                this.todoAddSuccess = succeeded;
                // Once we added a new Todo, refresh our todo list.
                // There is a more efficient method where we request for
                // this new todo from the server and add it to todos, but
                // for this lab it's not necessary
                //this.todoListComponent.refreshTodos();
            });
    }

}
