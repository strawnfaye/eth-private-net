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

@NgModule({
  declarations: [AppComponent, NodeComponent, NetworkComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatGridListModule
  ],
  providers: [NodeService],
  bootstrap: [AppComponent]
})
export class AppModule {}
