import { Component, OnInit } from '@angular/core';
import * as Web3 from 'web3';

declare let window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private web3Provider: null;
  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3(
        new Web3.providers.IpcProvider('../bob/geth.ipc')
      );
    }
    window.web3 = new Web3(this.web3Provider);
  }

  ngOnInit() {}
}
