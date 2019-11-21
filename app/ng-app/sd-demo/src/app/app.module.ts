import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NodeComponent } from './components/node/node.component';
import { NetworkComponent } from './components/network/network.component';
import { HttpClientModule } from '@angular/common/http';
import { NodeService } from './node.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { TransactionDialogComponent } from './components/transaction-dialog/transaction-dialog.component';
import { BlockComponent } from './components/block/block.component';
import { MinerBlurbComponent } from './components/miner-blurb/miner-blurb.component';

@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    NetworkComponent,
    TransactionDialogComponent,
    BlockComponent,
    MinerBlurbComponent
  ],
  entryComponents: [TransactionDialogComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSidenavModule,
    OverlayPanelModule
  ],
  providers: [NodeService],
  bootstrap: [AppComponent]
})
export class AppModule {}
