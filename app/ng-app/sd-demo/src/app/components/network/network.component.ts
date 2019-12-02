import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NodeService, Node, Block, Log, Transaction } from "../../node.service";

@Component({
  selector: "app-network",
  templateUrl: "./network.component.html",
  styleUrls: ["./network.component.scss"]
})
export class NetworkComponent implements OnInit {
  public nodes: Node[] = [];
  public loading: boolean = false;
  public blockchain: Block[] = [];
  public miner: string;
  public namesMap = new Map();
  public minerLogs: Log[] = [];
  public blockInterval: any;
  public logInterval: any;
  public logLineNumber = 0;

  constructor(private nodeService: NodeService) {}

  ngOnInit() {
    this.namesMap.set("0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6", "Alice");
    this.namesMap.set("0x8691bf25ce4a56b15c1f99c944dc948269031801", "Bob");
    this.namesMap.set("0xb1b6a66a410edc72473d92decb3772bad863e243", "Lily");
    this.namesMap.set("0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1", "Zach");
    this.namesMap.set("0xa9284bd5eec49c7a25037ed745089aee7b1ba25f", "Ross");

    this.nodeService.getAllNodes().subscribe(nodes => {
      nodes.forEach(node => {
        if (this.findIndex(this.nodes, node) === -1) {
          this.nodeService.getBalance(node).subscribe(balance => {
            let cols = 2;
            if (this.nodes.length === 0) {
              cols = 4;
            }
            const temp = new Node(node, cols, balance);
            this.nodes.push(temp);
          });
        }
      });
      this.nodeService.getMiner().subscribe(miner => {
        if (miner) {
          this.miner = miner;
          this.getBlockchain();
          this.getMinerLogs();
          this.blockInterval = setInterval(this.getBlockchain.bind(this), 3000);
          this.logInterval = setInterval(this.getMinerLogs.bind(this), 3000);
        }
      });
    });
  }

  public startNodes(): void {
    this.loading = true;
    this.nodeService.startAllNodes().subscribe(nodes => {
      nodes.forEach(node => {
        if (this.findIndex(this.nodes, node) === -1) {
          this.nodeService.getBalance(node).subscribe(balance => {
            let cols = 2;
            if (this.nodes.length === 0) {
              cols = 4;
            }
            const temp = new Node(node, cols, balance);
            this.nodes.push(temp);
          });
          this.nodeService.stopMiner(node).subscribe();
        }
      });
      this.loading = false;
    });
  }

  findIndex(array: Node[], name: string): number {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === name) {
        index = i;
        break;
      }
    }
    return index;
  }

  onMinerChange(name: string) {
    this.miner = name;
    if (this.miner) {
      this.blockInterval = setInterval(this.getBlockchain.bind(this), 3000);
      this.logInterval = setInterval(this.getMinerLogs.bind(this), 3000);
    } else {
      clearInterval(this.blockInterval);
      clearInterval(this.logInterval);
    }
  }

  getBlockchain() {
    this.nodeService
      .getBlocks(this.miner, this.blockchain.length)
      .subscribe(latestBlocks => {
        latestBlocks.forEach(block => {
          const addr = block.miner.toLowerCase();
          const miner = this.namesMap.get(addr);
          let txs = [];
          block.transactions.forEach(tx => {
            const temp = new Transaction(
              this.namesMap.get(tx.from.toLowerCase()),
              this.namesMap.get(tx.to.toLowerCase()),
              tx.hash,
              tx.value
            );
            txs.push(temp);
          });
          this.blockchain.push(
            new Block(block.number, miner, txs, block.hash, block.parentHash)
          );

          // if (document.getElementById("blockList")) {
          //   const topPosA = document.getElementById("blockchainBody").offsetTop;
          //   const topPosB = document.getElementById("blockList").offsetTop;
          //   console.log(topPosA, topPosB);
          //   console.log(document.getElementById("blockList"));
          //   document.getElementById("blockchainBody").scrollTop = topPosA;
          //   document.getElementById("blockList").scrollTop = topPosB;
          // }
        });
      });
  }

  getMinerLogs() {
    this.nodeService
      .getMinerLogs(this.miner, this.logLineNumber)
      .subscribe(res => {
        const lines = res.lines;
        this.logLineNumber = res.lineno;
        lines.forEach(line => {
          let temp = line.split("[", 2);
          let dateAndMessage = temp[1].split("]", 2);
          let dateString = dateAndMessage[0];
          let message = dateAndMessage[1].trim().split("   ", 3)[0] + "!";
          let messageOwner = this.miner;
          if (
            message.includes("Attempting commit of transaction from sender")
          ) {
            const split = message.split("sender");
            let sender = split[1].split(" in ")[0];
            sender = this.namesMap.get(sender.trim().toLowerCase());
            message = split[0] + sender + "!";
          } else if (message.includes("Verified concurrent history")) {
            messageOwner = "Tool";
          }
          let dateParts = dateString.split("|", 2);
          let date = dateParts[0].concat("-19 " + dateParts[1]);
          this.minerLogs.push(new Log(messageOwner, message, new Date(date)));
        });
      });
  }

  poolTransactions(): void {
    this.nodeService.poolTransactions().subscribe();
  }
}
