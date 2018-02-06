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
  selectedUserId: number;

  constructor(private route: ActivatedRoute,
              private groupsService: GroupsService,
              private modalService: NgbModal,
              private alertService: AlertService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.groupsService.getGroupDetails(id).subscribe(
      details => this.groupDetails = details,
      error => this.alertService.addErrorAlert('Could not load group details')
      );
  }

  open(content) {
    this.modalService.open(content).result.then((userLogin) => {
      this.groupsService.createInvitation(this.groupDetails.id, this.selectedUserId).subscribe(
        success => this.alertService.addSuccessAlert(`Sent invitation`),
        error => this.alertService.addErrorAlert('Error while sending invitation')
      );
    }, (reason) => {
      // this.closeResult = `Invitation cancelled`;
    });
  }

  selectUser(userId: number): void {
    this.selectedUserId = userId;
  }
}
