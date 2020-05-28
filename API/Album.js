var album = function Album(album_name)
{
    this.album_name = album_name;
    this.songs = {};

    // add a song
    this.addSong = function(song)
    {
        this.songs[song.song_name] = song;
    }

    // play song
    this.playSong = async function(song_name)
    {
        await this.songs[song_name].playMidi();
    }   

    this.songIsPlaying = function(song_name)
    {
        return this.songs[song_name].song_is_playing;
    }
}

// export album class
module.exports.create = album;