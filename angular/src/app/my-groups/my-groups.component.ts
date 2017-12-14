import { Component, OnInit } from '@angular/core';
import {AuthService} from '../service/auth.service';
import {GroupModel} from '../model/group-model';
import {GroupsService} from '../service/groups.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html'
})
export class MyGroupsComponent implements OnInit {
  groups: GroupModel[] = [
    {owner: {password: 'qwer', id: 1, name: 'Wojtek'}, owner_id: 1, id: 1, name: 'StaraGrupa'},
    {owner: {password: 'qwer', id: 2, name: 'Krzysio'}, owner_id: 2, id: 2, name: 'NowaGrupa'}
    ];

  constructor(private authService: AuthService, private groupsService: GroupsService) { }

  ngOnInit() {
    this.groupsService.getGroups().subscribe(groups => this.groups = groups);
  }

}
