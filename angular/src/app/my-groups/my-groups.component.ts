import { Component, OnInit } from '@angular/core';
import {AuthService} from '../service/auth.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html'
})
export class MyGroupsComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
