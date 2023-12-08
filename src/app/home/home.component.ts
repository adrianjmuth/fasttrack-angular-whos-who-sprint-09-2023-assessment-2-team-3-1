import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { UserSettings } from "../models/settings";
import { Track } from "../models/track";
import { Artist } from "../models/artist";
import { Router } from "@angular/router";
import { SettingsService } from "src/services/settings.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

const AUTH_ENDPOINT = "https://accounts.spotify.com/api/token";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
 
  constructor( private settingService: SettingsService,private router: Router, private fb: FormBuilder) {}
  
  userSettings!: UserSettings
  settingsForm!: FormGroup
 

  tracks!: Track[]
  artists!: Artist[]

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";
  error: String = "";



  ngOnInit(): void {
    this.settingService.currentSettings.subscribe((userSettings) => {
      this.userSettings = userSettings

      this.initForm()
    })

    // Subscribe the userSettings to the settingsService, which defaults the values as genre='', numSongs = 2, numArtists = 1
    this.settingService.currentSettings.subscribe(currentUserSettings => this.userSettings = currentUserSettings)
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);

    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }

    // Create a custom Spotify Dev token to use
    request(AUTH_ENDPOINT, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      method: 'POST',
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': 'bea12a29d9a94931a5e8c7c7d52ffb8f',
        'client_secret': '4b74f3a60e14456d9c54b6b2a13280b8'
      })
    }).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    this.genres = response.genres;
    this.configLoading = false;
  };

  setGenre(selectedGenre: string) {
    this.userSettings.genre = selectedGenre;
  }
  
  private initForm(): void {
    this.settingsForm = this.fb.group({
      genre: [this.userSettings.genre, [Validators.required]],
      numArtists: [this.userSettings.numArtists, [Validators.required, Validators.min(1), Validators.max(4)]],
      numSongs: [this.userSettings.numSongs, [Validators.required, Validators.min(1), Validators.max(4)]],
    }, { updateOn: 'change'});
  }

  onSubmit() {
    // Reset tracks/artists if user goes back to home and selects new genre
    this.tracks = []
    this.artists = []

    // Fetch Request for Spotify data based on the Genre. Limit range is 1-50
    fetchFromSpotify({
      token: this.token,
      endpoint: `search?q=genre%3D${this.userSettings.genre}&type=track&limit=50`
    }).then(response => { 
      // Create a list of Tracks from the Spotify API request
      let items: [any] = response.tracks.items
      
      items.forEach(track => {
        // If there is no 'preview_url', we skip that track
        if(track['preview_url'] != null) {
          // trackArtists - grab all the artists associated with that track
          let trackArtists: [any] = track['artists']
          let artistList: Artist[] = []
          let artistNames: string[] = []
          
          // Create Artist objects for each Artist on the Track
          trackArtists.forEach(artist => {
            let name:string = track['name']
            let newArtist: Artist = {
              songs: [name],
              name: artist['name']
            }
            artistNames.push(newArtist.name)
            artistList.push(newArtist)
          }) 

          // Create a new Track 
          let newTrack: Track = {
            previewUrl: track['preview_url'],
            name: track['name'],
            artists: artistNames,
          }

          // For each Artist in the Track, determine if it needs updating or adding to the List of Artists (this.artist)
          artistList.forEach(artist => {
            const existingArtist = this.artists.find(listArtist => artist['name'] === listArtist.name)

            // Check if Artist is already registered
            if(existingArtist) {
              // If artist exists, add the Track Name to their List of Tracks
              existingArtist.songs.push(newTrack.name)
            } else {
              // Otherwise, add a new Artist to the List of Artists
              this.artists.push(artist)
            }
          })
          
          // For the new Track, set the Artists on the Track based on their Artist Names
          newTrack.artists = artistNames
          this.tracks.push(newTrack) 
        }        
      });
    })
    
    // Store the user setting input for State Management
    this.settingService.updateUserSettings(this.userSettings)
    this.settingService.updateTrackList(this.tracks)
    this.settingService.updateArtistList(this.artists)

    this.router.navigateByUrl('/game')
  }
}
