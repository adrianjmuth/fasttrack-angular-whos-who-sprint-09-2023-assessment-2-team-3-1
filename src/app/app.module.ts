import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { GameComponent } from './game/game.component';
import { SongComponent } from './game/song/song.component';
import { ArtistComponent } from './game/artist/artist.component';

const routes: Routes = [{ path: "", component: HomeComponent }, { path: "game", component: GameComponent}];

@NgModule({
  declarations: [AppComponent, HomeComponent, GameComponent, SongComponent, ArtistComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), ReactiveFormsModule],
  providers: [HomeComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
