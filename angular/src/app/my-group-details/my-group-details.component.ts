import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GroupsService} from '../service/groups.service';
import {GroupFullModel} from '../model/group-model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../service/alert.service';
import {LoggedUserService} from '../service/logged-user.service';
import {FoodProviderModel} from '../model/food-provider.model';
import {FoodProvidersService} from '../service/food-providers.service';
import {TableAction} from '../table/table.component';
import {UserModel} from '../model/user-model';
import {FoodProviderRequestModel} from '../model/food-provider-request.model';

@Component({
  selector: 'app-my-group-details',
  templateUrl: './my-group-details.component.html'
})
export class MyGroupDetailsComponent implements OnInit {
  groupDetails: GroupFullModel;
  selectedUserId: number;
  foodProviders: FoodProviderModel[] = [];
  newProvider: FoodProviderRequestModel = new FoodProviderRequestModel();
  memberActions: TableAction[] = [
    {
      name: 'Remove',
      condition: item => this.isGroupOwner(),
      action: item => this.removeMember(item)
    }
  ];
  providerActions: TableAction[] = [
    {
      name: 'Delete',
      condition: item => this.isGroupOwner(),
      action: item => this.deleteProvider(item)
    }
  ];

  constructor(private route: ActivatedRoute,
              private groupsService: GroupsService,
              private modalService: NgbModal,
              private alertService: AlertService,
              private loggedUserService: LoggedUserService,
              private foodProvidersService: FoodProvidersService) {
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.getGroupDetails(id, true);
  }

  private getGroupDetails(id: number, getProviders: boolean) {
    this.groupsService.getGroupDetails(id).subscribe(
      details => {
        this.groupDetails = details;
        if (getProviders) {
          this.getFoodProviders();
        }
      },
      error => this.alertService.addErrorAlert('Could not load group details')
    );
  }

  private getFoodProviders() {
    this.foodProvidersService.getProvidersForGroup(this.groupDetails.id).subscribe(
      providers => this.foodProviders = providers,
      error => this.alertService.addErrorAlert('Could not load food providers')
    );
  }

  openInvite(content) {
    this.modalService.open(content).result.then((userLogin) => {
      this.groupsService.createInvitation(this.groupDetails.id, this.selectedUserId).subscribe(
        success => this.alertService.addSuccessAlert(`Sent invitation`),
        error => this.alertService.addErrorAlert('Error while sending invitation')
      );
    }, (reason) => {}
    );
  }

  openEdit(content) {
    this.modalService.open(content).result.then((name: string) => {
      this.groupsService.editGroupName(this.groupDetails.id, name).subscribe(
        success => {
          this.getGroupDetails(this.groupDetails.id, false);
          this.alertService.addSuccessAlert(`Changed group name`);
        },
        error => this.alertService.addErrorAlert('Error while changing group name')
      );
    }, (reason) => {}
    );
  }

  openProvider(content) {
    this.modalService.open(content).result.then((provider: FoodProviderRequestModel) => {
      this.foodProvidersService.createProvider(this.groupDetails.id, provider).subscribe(
        success => {
          this.getFoodProviders();
          this.alertService.addSuccessAlert(`Added food provider`);
        },
        error => this.alertService.addErrorAlert('Error while adding food provider')
      );
    }, (reason) => {}
    );
  }

  selectUser(userId: number): void {
    this.selectedUserId = userId;
  }

  isGroupOwner(): boolean {
    return this.groupDetails && this.groupDetails.owner.id === this.loggedUserService.loggedUser.getValue().id;
  }

  removeMember(member: UserModel): void {
    this.groupsService.removeGroupMember(this.groupDetails.id, member.id).subscribe(
      success => {
        this.getGroupDetails(this.groupDetails.id, false);
        this.alertService.addSuccessAlert(`'${member.username}' was removed from the group`);
      },
      error => this.alertService.addErrorAlert('Error while removing user from the group')
    );
  }

  deleteProvider(provider: FoodProviderModel): void {
    this.foodProvidersService.deleteProvider(provider.id).subscribe(
      success => {
        this.getFoodProviders();
        this.alertService.addSuccessAlert(`Food provider '${provider.name}' was deleted`);
      }
    );
  }
}
