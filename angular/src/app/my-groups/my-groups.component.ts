import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {GroupModel} from '../model/group-model';
import {GroupsService} from '../service/groups.service';
import {TableAction, TableColumn} from '../table/table.component';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoggedUserService} from '../service/logged-user.service';
import {AlertService} from "../service/alert.service";

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html'
})
export class MyGroupsComponent implements OnInit {
  groups: GroupModel[] = [];
  columns: TableColumn[] = [
    {name: 'Group name', data: 'name'},
    {name: 'Owner name', data: 'owner.username'}
  ];
  actions: TableAction[] = [
    // {
    //   name: 'Invite',
    //   condition: item => this.isGroupOwner(item),
    //   action: item => this.open(this.inviteModalContent, item)
    // },
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

  constructor(private loggedUserService: LoggedUserService,
              private groupsService: GroupsService,
              private modalService: NgbModal,
              private alertService: AlertService) { }

  ngOnInit() {
    this.getGroups();
  }

  private getGroups() {
    // this.groups = this.loggedUserService.loggedUser.getValue().groups;
    this.groupsService.getGroups().subscribe(groups => {
      console.log(groups);
      this.groups = groups;
    });
  }

  private isGroupOwner(item) {
    return this.loggedUserService.loggedUser.getValue() && this.loggedUserService.loggedUser.getValue().id === item.owner.id;
  }

  openCreateGroupModal(content) {
    this.modalService.open(content).result.then((groupName) => {
      // this.closeResult = `Creating group ${groupName}`;
      this.groupsService.addGroup(groupName).subscribe(result => {
        this.getGroups();
        this.alertService.addSuccessAlert(`Created group "${groupName}"`)
      });
    }, (reason) => {
      // this.closeResult = `Creation cancelled`;
    });
  }
}
