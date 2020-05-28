// import album creator
var album = require("./API/Album");

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Overview %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/*
This is a sample project where we create a single song within an album.  For each album 
you create, you should create a new project file.  Albums can contain any number of songs,
so if you're just looking to create songs you'll probably only ever need one of these project
files.

You have to have timidity (binary) installed in order to play songs.

*/


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Import Song Modules %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// import StillDoIt (song details are stored inside this file)
var StillDoIt = require('./songs/StillDoIt/StillDoIt');



// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Create Album %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// application entry point
var main = async function()
{

    // create new album
    var test_album = new album.create("Arbitrary Test Album Name");

    // add song(s) to album
    test_album.addSong(StillDoIt.song);

    // play a song (generates wav/midi)
    await test_album.playSong("StillDoIt");

}

// run main function
main().then(function(){});