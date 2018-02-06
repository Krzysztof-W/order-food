import { Component, OnInit } from '@angular/core';
import {GroupsService} from "../service/groups.service";
import {ActivatedRoute} from "@angular/router";
import {AlertService} from "../service/alert.service";
import {FoodProvidersService} from "../service/food-providers.service";
import {LoggedUserService} from "../service/logged-user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FoodProviderFullModel} from "../model/food-provider.model";

@Component({
  selector: 'app-food-provider-details',
  templateUrl: './food-provider-details.component.html'
})
export class FoodProviderDetailsComponent implements OnInit {
  provider: FoodProviderFullModel;

  constructor(private route: ActivatedRoute,
              private groupsService: GroupsService,
              private modalService: NgbModal,
              private alertService: AlertService,
              private loggedUserService: LoggedUserService,
              private foodProvidersService: FoodProvidersService) {
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
}
