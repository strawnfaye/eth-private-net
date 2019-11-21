import { Component, OnInit } from '@angular/core';
import { NodeService, Node, Block } from '../../node.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  public nodes: Node[] = [];
  public loading: boolean = false;
  public blockchain: Block[] = [];
  public miner: string;
  public namesMap = new Map();

  constructor(private nodeService: NodeService) {}

  ngOnInit() {
    this.namesMap.set('0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6', 'Alice');
    this.namesMap.set('0x8691bf25ce4a56b15c1f99c944dc948269031801', 'Bob');
    this.namesMap.set('0xb1b6a66a410edc72473d92decb3772bad863e243', 'Lily');
    this.namesMap.set('0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1', 'Zach');
    this.namesMap.set('0xa9284bd5eec49c7a25037ed745089aee7b1ba25f', 'Ross');

    this.nodeService.getAllNodes().subscribe(nodes => {
      console.log(nodes);
      nodes.forEach(node => {
        if (this.findIndex(this.nodes, node) === -1) {
          this.nodeService.getBalance(node).subscribe(balance => {
            let cols = 2;
            if (this.nodes.length === 0) {
              cols = 4;
            }
            const temp = new Node(node, cols, balance);
            console.log(temp);
            this.nodes.push(temp);
          });
        }
      });
      this.nodeService.getMiner().subscribe(miner => {
        if (miner) {
          console.log('active miner: ', miner);
          this.miner = miner;
          this.nodeService
            .getBlocks(miner, this.blockchain.length)
            .subscribe(latestBlocks => {
              latestBlocks.forEach(block => {
                const addr = block.miner.toLowerCase();
                console.log(addr);
                console.log(
                  '0x8691bf25ce4a56b15c1f99c944dc948269031801' === addr
                );
                const miner = this.namesMap.get(addr);
                this.blockchain.push(
                  new Block(
                    block.number,
                    miner,
                    block.transactions,
                    block.hash,
                    block.parentHash
                  )
                );
              });
            });
        }
      });
    });
  }

  public startNodes(): void {
    this.loading = true;
    this.nodeService.startAllNodes().subscribe(nodes => {
      console.log(nodes);
      nodes.forEach(node => {
        if (this.findIndex(this.nodes, node) === -1) {
          this.nodeService.getBalance(node).subscribe(balance => {
            let cols = 2;
            if (this.nodes.length === 0) {
              cols = 4;
            }
            const temp = new Node(node, cols, balance);
            console.log(temp);
            this.nodes.push(temp);
          });
        }
        console.log(this.nodes);
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

  onMinerStart(name: string) {
    this.miner = name;
    setInterval(this.getBlockchain.bind(this), 8000);
  }

  getBlockchain() {
    this.nodeService
      .getBlocks(this.miner, this.blockchain.length)
      .subscribe(latestBlocks => {
        console.log('in subscribe, blocks: ', latestBlocks);
        latestBlocks.forEach(block => {
          const addr = block.miner.toLowerCase();
          console.log(addr);
          console.log('0x8691bf25ce4a56b15c1f99c944dc948269031801' === addr);
          const miner = this.namesMap.get(addr);
          this.blockchain.push(
            new Block(
              block.number,
              miner,
              block.transactions,
              block.hash,
              block.parentHash
            )
          );
        });
      });
  }
}
