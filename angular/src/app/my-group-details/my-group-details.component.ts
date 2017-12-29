import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GroupsService} from '../service/groups.service';
import {GroupDetailsModel} from '../model/group-model';

@Component({
  selector: 'app-my-group-details',
  templateUrl: './my-group-details.component.html'
})
export class MyGroupDetailsComponent implements OnInit {
  groupDetails: GroupDetailsModel;

  constructor(private route: ActivatedRoute, private groupsService: GroupsService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.groupsService.getGroupDetails(id).subscribe(details => this.groupDetails = details);
  }
}
