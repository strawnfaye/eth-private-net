import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class Node {
  constructor(public name: string, public cols: number) {}
}

@Injectable()
export class NodeService {
  constructor(private http: HttpClient) {}

  getAllNodes(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8000/api/nodes');
  }

  startAllNodes(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8000/api/startNodes');
  }

  startMiner(name: string): Observable<any> {
    console.log('name: ', name);
    return this.http.get<any>(`http://localhost:8000/api/startMiner/${name}`);
  }

  sendTx(from: string, to: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/sendTx/${from}/${to}`);
  }

  printBlocks(name: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/printBlocks/${name}`);
  }
}
