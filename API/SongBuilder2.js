// filesystem
const fs = require('fs');

// assert
const assert = require('assert');

// jsmidgen
const jsmidgen = require('jsmidgen');

// scribbletune transposition layer
const transpose = require('./transpose');

// import instruments
const instruments_handle = require("./Instruments");

// create new instrument set from our instruments handle
var instruments = new instruments_handle.instruments;

// play the midi file
var nrc = require('node-run-cmd');


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Songbuilder 2 %%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// track used to compose 
function SongTrack(track_name, track_number, instrument_name, is_bottom_track = false)
{

	// set basic info
	this.instrument_name         = instrument_name;
	this.instrument              = instruments.getInstrumentNumberByName(instrument_name);
	this.track_number            = track_number;
	this.bars                    = [];
	this.current_bar_count       = 0;
	this.final_track_arrangement = null;
	this.is_bottom_track         = is_bottom_track;

	// set scribble for this track
	this.scribble = require('scribbletune');

	this.clip = require('./clip');

	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// %%% Add Bars %%%%%%%%%%%%%%%%%%%%%%%%%%%
	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

	// add a bar to the track
	this.addBar = function(add_clip)
	{
		
		// add clip to bars
		this.bars[this.current_bar_count] = 
		{
			section: add_clip.section,
			clip:    this.clip(add_clip)
		};

		// increment the bar count
		this.current_bar_count++;

	}

	// add bars from an array of clips
	this.addBars = function(clip_array)
	{
		var track = this;

		var section_name = null;
		clip_array.forEach(function(clip)
		{
			if(typeof clip.section === "string")
			if(section_name !== clip.section)
				section_name = clip.section;

			// add clip (automatically increments count)
			track.addBar(clip);

		});
		return true;
	}



	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// %%% Generate Bars %%%%%%%%%%%%%%%%
	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

	// generate all bars
	this.generateAllBars = function(repeat_count = 1)
	{

		// first generate all bars
		this.final_track_arrangement = null;
		var final_track_tmp = null;

		// generate all bars and repeat as necessary
		for(var repeat = 0; repeat < repeat_count; repeat++)
		{

			this.bars.forEach(function(bar_obj)
			{
				if(final_track_tmp === null)
				{
					final_track_tmp = bar_obj.clip;
				}
				else
				{
					final_track_tmp = final_track_tmp.concat(bar_obj.clip);
				}
			});

		}

		// set final track
		this.final_track_arrangement = final_track_tmp;

		// if we couldn't generate the track return false
		if(this.final_track_arrangement === null)
			return false;

		// return indicating success
		return true;

	};

	// attempt to generate a single song section
	this.generateSection = function(section)
	{

		console.log("Generating Section?: "+section)

		var section_start_pos = -1;
		var section_end_pos   = -1;
		for(var iter = 0; iter < this.bars.length; iter++)
		{

			// set clip
			var bar_obj = this.bars[iter];

			// calculate start position
			if(bar_obj.section === section)
			{
				section_start_pos = iter;
			}

			if(typeof bar_obj.section === "string")
			if(bar_obj.section.length > 0)
			if(bar_obj.section !== section && section_start_pos !== -1)
			{
				section_end_pos = iter-1;
				break;
			}
			
		}

		// set section start position
		if(section_start_pos !== -1)
		{

			// set section end position
			if(section_end_pos === -1)
				section_end_pos = this.bars.length -1;


			console.log("Generating between? " + section_start_pos + ","+ section_end_pos);
			// generate the bars
			return this.generateBarsBetween(section_start_pos, section_end_pos, 1, false);
		}
		else
		{
			console.log("Error: "+section + " failed to generate.");
			console.log(this.bars);
		}

		// return that we did not generate bars
		return false;

	}

	// generate song sections
	this.generateSections = function(sections)
	{

		// check if we have sections
		if(Array.isArray(sections) === false)
			return false;
		if(sections.length <= 0)
			return false;
		
		// iterate through sections
		for(var section_iter = 0; section_iter < sections.length; section_iter++)
		{

			// set section 
			var section = sections[section_iter];

			// generate the specified section
			this.generateSection(section);

		}

		// return true if we could generate things ok
		return true;


	}

	// generate bars between positions
	this.generateBarsBetween = function(start_pos = 0, end_pos = 0, repeat_count = 1, destroy_arrangement = true)
	{


		// if we have no start position set the full length remaining
		if(end_pos === -1)
			end_pos = this.bars.length;

		// ensure we have no mismatch
		if(end_pos < start_pos)
			return false;

		// create final song from bars
		if(destroy_arrangement === true)
			this.final_track_arrangement = null;

		for(var iter = start_pos; iter <= end_pos; iter++)
		{

			// set clip
			var bars_obj = this.bars[iter];
			if(typeof bars_obj !== "object")
				return false;

			if(this.final_track_arrangement === null)
			{
				this.final_track_arrangement = bars_obj.clip;
			}
			else
			{
				this.final_track_arrangement = this.final_track_arrangement.concat(bars_obj.clip);
			}
		}
		
		// return true if we could generate things ok
		return true;

	}

}


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Songbuilder %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// Options:
// {
// 	song_name: "Song Name"
// }

// song builder class
var sb2_instance = function SongBuilder2(options)
{

	// ensure our options are an object
	if(typeof options !== "object")
		return null;

	// song name
	this.song_name = options.song_name;

	// create file
	this.song_file = new jsmidgen.File();

	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// %%% Manipulate Tracks %%%%%%%%%%%%%%%%
	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

	// easily add all track parts
	this.easyAddAllTrackParts = function(params)
	{

		// create references
		var track_name          = params.track_name;
		var instrument          = params.instrument;
		var notes               = params.notes;
		var section_arangement  = params.section_arangement;
		var track_level         = params.track_level;
		

		// add the track
		this.addTrack(track_name, instrument, true);

		// add bars to the track
		this.tracks[track_name].addBars(notes);

		// generate sections in order via the arangement
		this.tracks[track_name].generateSections(section_arangement);

		// add the track to your output file
		this.addTrackToOutputFile(track_name, track_level);

	}

	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// %%% Manipulate Tracks %%%%%%%%%%%%%%%%
	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

	// tracks array (holds array of track objects)
	this.tracks = {};
	this.track_count = 0;

	// add a track to this composition
	this.addTrack = function(track_name, instrument, is_bottom_track = false)
	{

		// create our new track
		var new_track = new SongTrack
		(
			track_name, 
			this.track_count, 
			instrument, 
			is_bottom_track
		);

		// set track
		this.tracks[track_name] = new_track;

		// increment the track count		
		this.track_count++;

		// return the new track
		return new_track;

	}

	// retrieve the track
	this.getTrack = function(track_name)
	{
		return this.tracks[track_name];
	}



	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// %%% Track Builders %%%%%%%%%%%%%%%%%%
	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

	this.curr_channel_added = 0;

	// add track to output file
	this.addTrackToOutputFile = function(track_name, set_level = -1)
	{

		// set channel
		var chan = this.curr_channel_added;

		// this.song_file
		var track = this.tracks[track_name];
		if(typeof track !== "object")
			return false;

		// ensure we have a track arrangement
		if(track.final_track_arrangement === null)
			return false;

		// create new jsmidgen track
		var jsmidgen_track = new jsmidgen.Track();

		// add new track to file
		this.song_file.addTrack(jsmidgen_track);
		jsmidgen_track.setInstrument(chan, track.instrument);

		// synchronously add tracks (requires synchronosity)
		for
		(
			var iter = 0; 
			iter < track.final_track_arrangement.length; 
			iter++
		)
		{

			// set note object 
			var noteObj = track.final_track_arrangement[iter];

			// set note volume level
			let level = noteObj.level || 127;

			// set the level
			if(set_level !== -1)
				level = set_level;

			// While writing chords (multiple notes per tick)
			// only the first noteOn (or noteOff) needs the complete arity of the function call
			// subsequent calls need only the first 2 args (channel and note)
			if (noteObj.note) 
			{

				// Transpose the note to the correct middle C (in case middle C was changed)
				noteObj.note = transpose.transposeNote(noteObj.note);

				if (typeof noteObj.note === 'string') 
				{

					// jsmidgen_track.addNote(chan, noteObj.note, noteObj.length);
					// channel, pitch(note), length, velocity
					jsmidgen_track.noteOn(0, noteObj.note, noteObj.length, level); 
					jsmidgen_track.noteOff(0, noteObj.note, noteObj.length, level);
				} 
				else 
				{
					jsmidgen_track.addChord(chan, noteObj.note, noteObj.length, level);
				}

			} 
			else 
			{
				jsmidgen_track.noteOff(chan, '', noteObj.length);
			}
		}
		


		
		// this.song_file
		this.curr_channel_added++;

		// return indicating success
		return true;

	}

	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// %%% Generate File Output %%%%%%%%%%%%
	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


	// this will attempt to generate the final file
	this.generateMidiFile = function()
	{

		fs.writeFileSync(this.song_name + ".mid", this.song_file.toBytes(), 'binary');

	}

	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	// %%% Play File %%%%%%%%%%%%%%%%%%%%%%%
	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

	// play the generated midi file
	this.playMidi = async function()
	{

		// set file name
		var tmp_file_name = this.song_name;

		// ensure that the filename is alphanumeric
		if(/^[a-z0-9]+$/i.test(tmp_file_name) === false)
		{
			console.log("Error: The filename '"+tmp_file_name+"' provided must be alphanumeric only.");
			return false;
		}
		
		// add mid suffix
		tmp_file_name += ".mid";

		// play midi
		console.log("playMidi: Starting to generate wav file from midi file.");

		// Generate wav file
		await new Promise(function(resolve, reject)
		{

			// run timidity to generate wav file
			nrc.run('nice -n "-20" timidity --output-24bit -A120 '+tmp_file_name + " -Ow -o "+tmp_file_name+".wav", 
			{
				onData: function(chdata){},
				onDone: function(code)
				{
					console.log("playMidi: Finished generating WAV from MIDI using timidity (apt-get install timidity).  Now attempting to play file.");
					resolve();
				}
			});
			
		});

		// play the midi file	
		await new Promise(function(resolve, reject)
		{
			nrc.run('nice -n "-20" play ' + tmp_file_name+".wav", 
			{
				onData: function(chdata){},
				onDone: function(code)
				{
					console.log("playMidi: Finished playing "+tmp_file_name+".wav using play utility (apt-get install sox)");
					resolve();
				}
			});
			
		});

		// return after we've played the song
		return true;
	}

};

// export the clip builder
module.exports.sb2 = sb2_instance;

