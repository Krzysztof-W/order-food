import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {GroupModel} from '../model/group-model';
import {GroupsService} from '../service/groups.service';
import {TableAction, TableColumn} from '../table/table.component';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoggedUserService} from '../service/logged-user.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html'
})
export class MyGroupsComponent implements OnInit {
  groups: GroupModel[] = [
    {owner: {password: 'qwer', id: 0, name: 'Wojtek'}, owner_id: 1, id: 1, name: 'StaraGrupa'},
    {owner: {password: 'qwer', id: 1, name: 'Krzysio'}, owner_id: 2, id: 2, name: 'NowaGrupa'}
  ];
  columns: TableColumn[] = [
    {name: 'Group name', data: 'name'},
    {name: 'Owner name', data: 'owner.name'}
  ];
  actions: TableAction[] = [
    {
      name: 'Details',
      condition: item => true,
      action: item => null
    },
    {
      name: 'Invite',
      condition: item => this.isGroupOwner(item),
      action: item => this.open(this.inviteModalContent, item)
    },
    {
      name: 'Delete',
      condition: item => this.isGroupOwner(item),
      action: item => null
    },
    {
      name: 'Leave',
      condition: item => !this.isGroupOwner(item),
      action: item => null
    }
  ];

  private isGroupOwner(item) {
    return this.loggedUserService.loggedUser.getValue() && this.loggedUserService.loggedUser.getValue().id === item.owner.id;
  }

  selectedGroup: GroupModel;
  @ViewChild('inviteModalContent') inviteModalContent;
  closeResult: string;

  constructor(private loggedUserService: LoggedUserService, private groupsService: GroupsService, private modalService: NgbModal) { }

  ngOnInit() {
    // this.groupsService.getGroups().subscribe(groups => this.groups = groups);
  }

  open(content, group: GroupModel) {
    this.selectedGroup = group;
    this.modalService.open(content).result.then((userLogin) => {
      this.closeResult = `Invitation for ${userLogin} to ${group.name}`;
    }, (reason) => {
      this.closeResult = `Invitation cancelled`;
    });
  }
}
