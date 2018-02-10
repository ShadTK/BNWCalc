import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CharacterComponent } from './character/character.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './header/dropdown.directive';

import { BattleService } from './battle.service';

@NgModule({
  declarations: [
    AppComponent,
    CharacterComponent,
    DropdownDirective,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    BattleService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
