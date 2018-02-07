import { Component, OnInit } from '@angular/core';
import {GroupsService} from '../service/groups.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../service/alert.service';
import {FoodProvidersService} from '../service/food-providers.service';
import {LoggedUserService} from '../service/logged-user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FoodProviderFullModel} from '../model/food-provider.model';
import {OrderService} from '../service/order.service';

@Component({
  selector: 'app-food-provider-details',
  templateUrl: './food-provider-details.component.html'
})
export class FoodProviderDetailsComponent implements OnInit {
  provider: FoodProviderFullModel;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private groupsService: GroupsService,
              private modalService: NgbModal,
              private alertService: AlertService,
              private loggedUserService: LoggedUserService,
              private foodProvidersService: FoodProvidersService,
              private orderService: OrderService) {
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.getProviderDetails(id, true);
  }

  private getProviderDetails(id: number, getProviders: boolean) {
    this.foodProvidersService.getProvider(id).subscribe(
      details => {
        this.provider = details;
      },
      error => this.alertService.addErrorAlert('Could not load provider details')
    );
  }

  openOrder(content) {
    this.modalService.open(content).result.then((description: string) => {
        this.orderService.openOrder(this.provider.id, description).subscribe(
          order => {
            this.router.navigate(['order/' + order.id]);
            this.alertService.addSuccessAlert(`Order opened`);
          },
          error => this.alertService.addErrorAlert('Error while changing group name')
        );
      }, (reason) => {}
    );
  }
}
