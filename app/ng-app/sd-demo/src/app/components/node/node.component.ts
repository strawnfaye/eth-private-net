import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NodeService, Node } from '../../node.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';

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
  @Input() set nodes(nodes: Node[]) {
    this._nodes = nodes;
  }
  @Output() mining = new EventEmitter<string>();

  public _name: string;
  public _address: string;
  public _nodes: Node[];
  public accountBalance;
  public txHistory: any[] = [];
  public minerLogs: string[] = [];
  sendTo: string;
  amount: number;

  constructor(private nodeService: NodeService, public dialog: MatDialog) {}

  ngOnInit() {}

  startMiner(): void {
    this.nodeService.startMiner(this._name).subscribe(result => {
      console.log('about to emit event saying', this._name, 'is mining');
      this.mining.emit(this._name);
    });
    // this.nodeService.getMinerLogs(this._name, 0).subscribe();
  }

  sendTx(to: string) {
    this.nodeService.sendTx(this._name, to).subscribe();
  }

  printBlocks(): void {
    this.nodeService.getMinerLogs(this._name, 0).subscribe(res => {
      res.forEach(line => {
        this.minerLogs.push(line);
      });
      console.log(this.minerLogs);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '250px',
      data: {
        nodes: this._nodes,
        sendFrom: this._name,
        sendTo: this.sendTo,
        amount: this.amount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed. Result: ', result);
      this.sendTo = result;
      if (result) {
        this.sendTx(this.sendTo);
      }
    });
  }
}
