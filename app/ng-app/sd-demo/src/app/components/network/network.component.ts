import { Component, OnInit } from '@angular/core';
import { NodeService, Node } from '../../node.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  public nodes: Node[] = [];
  public loading: boolean = false;

  constructor(private nodeService: NodeService) {}

  ngOnInit() {
    this.nodeService.getAllNodes().subscribe(nodes => {
      console.log(nodes);
      nodes.forEach(node => {
        if (this.findIndex(this.nodes, node) === -1) {
          let cols = 2;
          if (this.nodes.length === 0) {
            cols = 4;
          }
          const temp = new Node(node, cols);
          console.log(temp);
          this.nodes.push(temp);
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
          let cols = 2;
          if (this.nodes.length === 0) {
            cols = 4;
          }
          const temp = new Node(node, cols);
          console.log(temp);
          this.nodes.push(temp);
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
}
