import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Artist } from 'src/app/models/artist';
import { UserSettings } from 'src/app/models/settings';
import { Track } from 'src/app/models/track';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private userSettings = new BehaviorSubject<UserSettings>({
    genre: '',
    numSongs: 2,
    numArtists: 1
  })
  currentSettings = this.userSettings.asObservable()

  private genreSetting = new BehaviorSubject<string>('')
  currentGenreSetting = this.genreSetting.asObservable()

  private songNumSetting = new BehaviorSubject<number>(2)
  currentSongNumSetting = this.songNumSetting.asObservable()

  private artistNumSetting = new BehaviorSubject<number>(1)
  currentArtistNumSetting = this.artistNumSetting.asObservable()

  private tracks = new BehaviorSubject<Track[]>([])
  currentTracks = this.tracks.asObservable()

  private artists = new BehaviorSubject<Artist[]>([])
  currentArtists = this.artists.asObservable()

  updateUserSettings(newSettings: UserSettings) {
    this.userSettings.next(newSettings)
    this.genreSetting.next(newSettings.genre)
    this.songNumSetting.next(newSettings.numSongs)
    this.artistNumSetting.next(newSettings.numArtists)
  }

  updateTrackList(newTracks: Track[]) {
    this.tracks.next(newTracks)
  }

  updateArtistList(newArtists: Artist[]) {
    this.artists.next(newArtists)
  }

  constructor() { }
}
