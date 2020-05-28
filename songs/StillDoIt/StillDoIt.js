// require our custom clip builder
var Songbuilder2API = require('../../API/SongBuilder2');


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Still Do It %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/*
Third experimental song created with this project.  Just ironing out the bugs.  And testing track generation.
*/


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Import Notes for Various Tracks %%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// require our custom clip builder
var note_utils = require('../../API/note_utils');

// base track file (this is the lowest track of your arrangement)
var base_track_file = "StillDoIt/hum_track.js";

// import track notes (must provide recursing path since module has different __dirpath)
var hum_track_notes    = note_utils.importNotesFromFile(base_track_file,    base_track_file);
var bottom_track_notes = note_utils.importNotesFromFile("StillDoIt/bottom_track.js", base_track_file);
var mid_track_notes    = note_utils.importNotesFromFile("StillDoIt/mid_track.js",    base_track_file);

// import drum track notes
var drum_track_1_notes    = note_utils.importNotesFromFile("StillDoIt/drum_track1.js",    base_track_file);
var drum_track_2_notes    = note_utils.importNotesFromFile("StillDoIt/drum_track2.js",    base_track_file);
var drum_track_3_notes    = note_utils.importNotesFromFile("StillDoIt/drum_track3.js",    base_track_file);

// -- optional visualization ----------

/*
console.log("\n[+] Hum Track:");
note_utils.visualizeNotes(hum_track_notes);
console.log("\n[+] Mid Track:");
note_utils.visualizeNotes(mid_track_notes);
console.log("\n[+] Bottom Track:");
note_utils.visualizeNotes(bottom_track_notes);
*/


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Arrange Song Tracks %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// create new songbuilder
var sb = new Songbuilder2API.sb2
({
	song_name: "StillDoIt"
});

// ----- add tracks (so we can add bars to them) --------

// add bottom track
sb.addTrack("track1",  "synth_bass_organ", true);
sb.addTrack("track2",  "synth_glass_reverb_bass");
sb.addTrack("track3",  "low_breathy_rum_jug_wind");
sb.addTrack("track4",  "indian_reverb_twangy_instrument");
sb.addTrack("track5",  "xylophone_rattling_low_very_cool_bass");

// add drum tracks
sb.addTrack("track6",  "giant_deep_awesome_sounding_drum");
sb.addTrack("track7",  "heavy_huge_drums");
sb.addTrack("track8",  "nice_clean_heavy_kick_drums");



// ---- add all bars/notes to new tracks ---------------

// hum tracks
sb.tracks["track1"].addBars(hum_track_notes);

// bottom beat tracks
sb.tracks["track2"].addBars(bottom_track_notes);
sb.tracks["track3"].addBars(bottom_track_notes);

// mid beat tracks
sb.tracks["track4"].addBars(mid_track_notes);
sb.tracks["track5"].addBars(mid_track_notes);

// drum tracks
sb.tracks["track6"].addBars(drum_track_1_notes);
sb.tracks["track7"].addBars(drum_track_2_notes);
sb.tracks["track8"].addBars(drum_track_3_notes);


// sections to generate
var sections = 
[
	"verse1_1",
	"verse1_1",
	"bridge1_1",
	"chorus1_1",	
	"chorus1_2",
	"verse1_1",
	"verse1_1",
	"bridge1_1",
	"bridge1_2",
	"chorus1_2",
	"verse1_2"
];



// generate sections for tracks
sb.tracks["track1"].generateSections(sections);
sb.tracks["track2"].generateSections(sections);
sb.tracks["track3"].generateSections(sections);
sb.tracks["track4"].generateSections(sections);
sb.tracks["track5"].generateSections(sections);
sb.tracks["track6"].generateSections(sections);
sb.tracks["track7"].generateSections(sections);
sb.tracks["track8"].generateSections(sections);


// track volume levels, increase or decrease the track volumes based on 
// your preference.
var track_1_level = 60;
var track_2_level = 30;
var track_3_level = 30;
var track_4_level = 30;
var track_5_level = 40;
var track_6_level = 110;
var track_7_level = 70;
var track_8_level = 50;


// add tracks to output after generation
sb.addTrackToOutputFile("track1", track_1_level);
sb.addTrackToOutputFile("track2", track_2_level);
sb.addTrackToOutputFile("track3", track_3_level);
sb.addTrackToOutputFile("track4", track_4_level);
sb.addTrackToOutputFile("track5", track_5_level);
sb.addTrackToOutputFile("track6", track_6_level);
sb.addTrackToOutputFile("track7", track_7_level);
sb.addTrackToOutputFile("track8", track_8_level);

// generate four final midi file
sb.generateMidiFile();

// export the song
module.exports.song = sb;
