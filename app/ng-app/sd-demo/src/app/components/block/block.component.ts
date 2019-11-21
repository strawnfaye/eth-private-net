import { Component, OnInit, Input } from '@angular/core';
import { Block } from '../../node.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() set block(block: Block) {
    this._block = block;
  }

  public _block: Block;

  constructor() {}

  ngOnInit() {}
}
