import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UserModel} from '../model/user-model';
import {TableAction} from '../table/table.component';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import {GroupsService} from '../service/groups.service';
import 'rxjs/add/operator/filter';
import {LoggedUserService} from "../service/logged-user.service";

@Component({
  selector: 'app-search-user',
  templateUrl: 'search-user.component.html'
})
export class SearchUserComponent implements OnInit {
  @Output() userId: EventEmitter<number> = new EventEmitter<number>();
  subject: Subject<string> = new Subject<string>();
  @ViewChild('userNameInput') input: HTMLInputElement;
  actions: TableAction[] = [
    {
      name: 'Invite',
      condition: () => true,
      action: item => this.userId.emit(item.id)
    }
  ];
  users: UserModel[] = [];

  constructor(private groupService: GroupsService,
              private loggedUserService: LoggedUserService) {
  }

  ngOnInit(): void {
    this.subject
      .filter(word => word.length > 2)
      .debounceTime(200)
      .switchMap(value => this.groupService.getUsers(value)).subscribe(
        users => this.users = users.filter(user => user.id !== this.loggedUserService.loggedUser.getValue().id)
    );
  }

  onChange(value: string): void {
    this.subject.next(value);
  }
}
