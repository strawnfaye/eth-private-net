import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class Node {
  constructor(
    public name: string,
    public cols: number,
    public balance: number
  ) {}
}

export class Block {
  constructor(
    public number: number,
    public miner: string,
    public transactions: any[],
    public hash: string,
    public parentHash: string
  ) {}
}

export class Log {
  constructor(
    public miner: string,
    public message: string,
    public timeStamp: Date
  ) {}
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

  sendTx(from: string, to: string, amount: number): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8000/api/sendTx/${from}/${to}/${amount}`
    );
  }

  getBlocks(miner: string, atBlock: number): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8000/api/getBlocks/${miner}/${atBlock}`
    );
  }

  getMinerLogs(miner: string, line: number): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8000/api/getMinerLogs/${miner}/${line}`
    );
  }

  getBalance(name: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/getBalance/${name}`);
  }

  getMiner(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/getMiner`);
  }
}
