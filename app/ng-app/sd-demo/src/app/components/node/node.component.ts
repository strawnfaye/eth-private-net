import { Component, OnInit, Input } from '@angular/core';
import { NodeService, Node } from '../../node.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss', '../../app.component.scss']
})
export class NodeComponent implements OnInit {
  @Input()
  set name(name: string) {
    this._name = name;
  }
  @Input()
  set address(address: string) {
    this._address = address;
  }
  public _name: string;
  public _address: string;

  constructor(private nodeService: NodeService) {}

  ngOnInit() {}

  startMiner(): void {
    this.nodeService.startMiner(this._name).subscribe();
  }
}
