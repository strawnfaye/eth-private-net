import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { NetworkComponent } from '../network/network.component';
import { Node } from '../../node.service';

export interface DialogData {
  nodes: Node[];
  sendFrom: string;
  sendTo: string;
  amount: number;
}

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {
  nodeList: string[] = [];
  sendFromNode: Node;

  constructor(
    public dialogRef: MatDialogRef<NetworkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    console.log('dialog data: ', data);
    data.nodes.forEach(node => {
      if (node.name !== data.sendFrom) {
        this.nodeList.push(node.name);
      } else {
        this.sendFromNode = node;
      }
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}
}
