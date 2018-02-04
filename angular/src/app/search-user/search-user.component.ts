import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UserModel} from '../model/user-model';
import {TableAction} from '../table/table.component';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import {GroupsService} from '../service/groups.service';

@Component({
  selector: 'app-search-user',
  templateUrl: 'search-user.component.html'
})
export class SearchUserComponent implements OnInit {
  @Output() customerId: EventEmitter<number> = new EventEmitter<number>();
  subject: Subject<string> = new Subject<string>();
  @ViewChild('userNameInput') input: HTMLInputElement;
  actions: TableAction[] = [
    {
      name: 'Invite',
      condition: () => true,
      action: item => this.customerId.emit(item.id)
    }
  ];
  users: UserModel[];

  constructor(private groupService: GroupsService) {
  }

  ngOnInit(): void {
    this.subject.debounceTime(500).switchMap(value => this.groupService.getUsers(value)).subscribe(users => this.users = users);
  }

  onChange(value: string): void {
    this.subject.next(value);
  }
}
