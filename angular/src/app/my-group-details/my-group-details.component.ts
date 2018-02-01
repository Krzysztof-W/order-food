import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GroupsService} from '../service/groups.service';
import {GroupFullModel, GroupModel} from '../model/group-model';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "../service/alert.service";

@Component({
  selector: 'app-my-group-details',
  templateUrl: './my-group-details.component.html'
})
export class MyGroupDetailsComponent implements OnInit {
  groupDetails: GroupFullModel;

  constructor(private route: ActivatedRoute,
              private groupsService: GroupsService,
              private modalService: NgbModal,
              private alertService: AlertService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.groupsService.getGroupDetails(id).subscribe(details => this.groupDetails = details);
  }

  open(content) {
    this.modalService.open(content).result.then((userLogin) => {
      // this.groupsService.createInvitation();
      this.alertService.addSuccessAlert(`Sent invitation to "${userLogin}"`)
    }, (reason) => {
      // this.closeResult = `Invitation cancelled`;
    });
  }
}
