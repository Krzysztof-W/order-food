import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoggedUserService} from '../service/logged-user.service';
import {UserFullModel} from '../model/user-model';
import {TableAction, TableColumn} from '../table/table.component';
import {InvitationModel} from '../model/invitation-model';
import {GroupsService} from '../service/groups.service';
import {AlertService} from '../service/alert.service';
import {OrderModel} from '../model/order.model';
import {OrderService} from '../service/order.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: UserFullModel;
  orders: OrderModel[] = [];
  userSubscription: Subscription;
  orderColumns: TableColumn[] = [
    {name: 'Food provider', data: 'foodProvider.name'},
    {name: 'Description', data: 'description'},
    {name: 'Owner', data: 'orderOwner.username'},
    {name: 'Status', data: 'status'}
  ];
  recInvColumns: TableColumn[] = [
    {name: 'Group name', data: 'group.name'},
    {name: 'Owner name', data: 'sender.username'}
  ];
  recInvActions: TableAction[] = [
    {
      name: 'Accept',
      condition: item => true,
      action: item => this.processInvitation(item, true)
    },
    {
      name: 'Reject',
      condition: item => true,
      action: item => this.processInvitation(item, false)
    }
  ];
  sentInvColumns: TableColumn[] = [
    {name: 'Invited user', data: 'invitedUser.username'},
    {name: 'Group name', data: 'group.name'}
  ];
  sentInvActions: TableAction[] = [
    {
      name: 'Cancel',
      condition: item => true,
      action: item => this.cancelInvitation(item)
    }
  ];

  constructor(private loggedUserService: LoggedUserService,
              private groupsService: GroupsService,
              private alertService: AlertService,
              private orderService: OrderService) {
  }

  ngOnInit() {
    this.loggedUserService.refreshUser();
    this.userSubscription = this.loggedUserService.loggedUser.subscribe(user => {
      this.user = user;
      this.orderService.getOrders(user.id).subscribe(
        orders => this.orders = orders,
        error => this.alertService.addErrorAlert('Could not load orders')
      )
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  processInvitation(invitation: InvitationModel, decision: boolean): void {
    this.groupsService.processInvitation(invitation.id, decision).subscribe(
      success => {
        this.loggedUserService.refreshUser();
        this.alertService.addSuccessAlert('Invitation ' + (decision ? 'accepted' : 'rejected'));
      },
      error => this.alertService.addErrorAlert('Error while processing invitation')
    );
  }

  cancelInvitation(invitation: InvitationModel): void {
    this.groupsService.deleteInvitation(invitation.id).subscribe(
      success => {
        this.loggedUserService.refreshUser();
        this.alertService.addSuccessAlert('Invitation cancelled');
      },
      error => this.alertService.addErrorAlert('Error while cancelling invitation')
    );
  }
}
