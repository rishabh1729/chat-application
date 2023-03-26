import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppConnectComponent } from './app-connect/app-connect.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';


const routes: Routes = [
  { path: 'home', component: AppConnectComponent },
  { path: 'chat-window', component: ChatWindowComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
