import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NodeService, Node } from "../../node.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { TransactionDialogComponent } from "../transaction-dialog/transaction-dialog.component";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-node",
  templateUrl: "./node.component.html",
  styleUrls: ["./node.component.scss", "../../app.component.scss"],
  providers: [MessageService]
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
  @Input() set canMine(canMine: boolean) {
    this._canMine = canMine;
  }
  @Output() mining = new EventEmitter<string>();

  public _name: string;
  public _address: string;
  public _nodes: Node[];
  public accountBalance;
  public txHistory: any[] = [];
  public minerLogs: string[] = [];
  public _canMine: boolean;
  public isMining: boolean = false;
  sendTo: string;
  amount: number;

  constructor(
    private nodeService: NodeService,
    public dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  startMiner(): void {
    this.nodeService.startMiner(this._name).subscribe(result => {
      console.log(this._name, "is mining");
      this.mining.emit(this._name);
      this.isMining = true;
      this.messageService.add({
        severity: "success",
        summary: "Started Mining",
        detail: `${this._name}'s miner is running.`
      });
    });
  }

  stopMiner(): void {
    this.nodeService.stopMiner(this._name).subscribe(result => {
      console.log(this._name, "stopped mining");
      this.mining.emit(undefined);
      this.isMining = false;
      this.messageService.add({
        severity: "success",
        summary: "Stopped Mining",
        detail: `${this._name}'s miner is no longer running.`
      });
    });
  }

  sendTx(to: string, amount: number) {
    this.nodeService.sendTx(this._name, to, amount).subscribe(receipt => {
      console.log(receipt);
      if (receipt) {
        this.messageService.add({
          severity: "success",
          summary: "Sent Transaction",
          detail: `Transaction from ${this._name} has been submitted.`
        });
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Error Sending Transaction",
          detail: `${this._name}'s transaction was not sent.`
        });
      }
    });
  }

  printBlocks(): void {}

  openDialog(): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: "250px",
      data: {
        nodes: this._nodes,
        sendFrom: this._name,
        sendTo: this.sendTo,
        amount: this.amount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed. Result: ", result);
      this.sendTo = result.sendTo;
      this.amount = result.amount;
      if (result) {
        this.sendTx(this.sendTo, this.amount);
      }
    });
  }
}
