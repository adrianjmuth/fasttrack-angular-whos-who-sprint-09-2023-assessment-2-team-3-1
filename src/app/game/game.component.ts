import { Component, OnInit } from '@angular/core';
import { Track } from "../models/track";
import { Artist } from "../models/artist";
import { SettingsService } from 'src/services/settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  // for testing randomization
  testArtists: Artist[] = [
    {
      songs: ["a", "b", "c"],
      name: "one"
    },
    {
      songs: ["a", "b", "c"],
      name: "two"
    },
    {
      songs: ["a", "b", "c"],
      name: "three"
    },
    {
      songs: ["a", "b", "c"],
      name: "four"
    },
    {
      songs: ["a", "b", "c"],
      name: "five"
    },
  ];
  testTracks: Track[] = [
    {
      previewUrl: "url",
      name: "name",
      artists: ["one"]
    },
    {
      previewUrl: "url",
      name: "name",
      artists: ["two"]
    },
    {
      previewUrl: "url",
      name: "name",
      artists: ["three"]
    },
    {
      previewUrl: "url",
      name: "name",
      artists: ["four"]
    },
    {
      previewUrl: "url",
      name: "name",
      artists: ["five"]
    },
  ]

  constructor(private settingsService: SettingsService, private router: Router) { }

  ngOnInit(): void {

    console.log("hi from game!");
    console.log(this.getRandomArtist(this.testArtists));
    console.log(this.getRandomSongs(this.getRandomArtist(this.testArtists), this.testTracks, 1));

    console.log("IN GAME CONSOLE: ", this.settingsService.currentSettings)
    console.log("IN GAME Console ~ TRACKS: ", this.settingsService.currentTracks)
    console.log("IN GAME Console ~ ARTISTS: ", this.settingsService.currentArtists)
  }

  // reloads page when an artist is selected
  onSubmit() {
    window.location.reload();
  }

  getRandomArtist(artistList: Artist[]) {
    return artistList[Math.floor(Math.random() * artistList.length)];
  }

  getRandomSongs(artist: Artist, trackList: Track[], numSongs: number) {
    let withArtistList = [];
    let withoutArtistList = [];
    let randomSongs = [];

    for (let track in trackList) {
      if (trackList[track].artists.includes(artist.name)) {
        withArtistList.push(trackList[track]);
      } else {
        withoutArtistList.push(trackList[track]);
      }
    }

    // referenced https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
    randomSongs.push(Math.floor(Math.random() * withArtistList.length));
    withoutArtistList = withoutArtistList.sort(() => Math.random() - 0.5);
    randomSongs.push(withoutArtistList.slice(0, numSongs));
    return randomSongs.sort(() => Math.random() - 0.5);
  }

}
