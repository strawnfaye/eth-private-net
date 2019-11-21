import { Component, OnInit, Input } from '@angular/core';
import { Log } from '../../node.service';

@Component({
  selector: 'app-miner-blurb',
  templateUrl: './miner-blurb.component.html',
  styleUrls: ['./miner-blurb.component.scss']
})
export class MinerBlurbComponent implements OnInit {
  @Input() set log(log: Log) {
    this._log = log;
  }

  public _log: Log;

  constructor() {}

  ngOnInit() {}
}
