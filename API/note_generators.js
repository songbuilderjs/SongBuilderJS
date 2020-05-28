// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Add Empty Section/Sections %%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


// add empty sections
var addEmptySectionsToNotes = function(sections, notes, skip_existing = false)
{
    var empty_sections = [];
    // iterate through sections
    sections.forEach(function(section)
    {
        if(skip_existing === true)
        if(hasSection(section, notes) === true)
            return false;

        console.log("Adding empty section?: "+section);
        empty_sections.push(addEmptySectionToNotes(section, notes));

    });

    return empty_sections;
}

// add empty section
var addEmptySectionToNotes = function(section_name)
{
    var ret_note = generateEmptyNotes(1);
    ret_note[0].section = section_name;
    return ret_note[0];
}

// generate empty notes
var generateEmptyNotes = function(how_many_notes, note_length = "1/16")
{

    var ret_notes = [];
    for(var note_idx = 0; note_idx < how_many_notes; note_idx++)
    {
        ret_notes.push
        ({
            notes: ['c0'],
            pattern: '-'
        });
    }
    return ret_notes;
}


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Lookup Utilities %%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// does a note set contain a section
var hasSection = function(section_name, notes)
{

    var has_section = false;
    notes.forEach(function(note)
    {
        if(typeof note.section === "string")
        {
            if(note.section === section_name)
            {
                has_section = true;
            }
        }
    });
    return has_section;

}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Random Generators %%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


var generateRandomBackgroundSection = function(params)
{

    var section_name  = params.section_name;
    var note_sections = params.note_sections;

    // iterate through note sections
    note_sections.forEach(function(note_section)
    {

        if(note_section[0] === "random")
            note_section[0] = generateRandomNote({});

    });

    // generate rush background
    var new_random_sections = generateBackgroundSection
    ({
        section_name: section_name,
        note_sections: note_sections
    });

    return new_random_sections;
};

// generate a random note
var generateRandomNote = function(params)
{


    var notes = 
    [
        'c',
        'd',
        'e',
        'f',
        'g',
        'a',
        'b'
    ];

    var octaves = 
    [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9'
    ];


    // get parameters
    var random_sharp = params.random_sharp;
    var octave_min = params.octave_min;
    var octave_max = params.octave_max;
    var note_min   = params.note_min;
    var note_max   = params.note_max;

    // octave indexes
    var octave_min_idx = octaves.indexOf(note_min);
    var octave_max_idx = octaves.indexOf(note_max);
    var note_min_idx   = notes.indexOf(note_min);
    var note_max_idx   = notes.indexOf(note_max);

    // ensure the min is greater than the max
    if(note_min_idx > note_max_idx)
        return null;
    
    // note minimum index
    if(note_min_idx !== -1)
    {
        notes = notes.split
        (
            0, 
            note_min_idx
        );
    }

    // split the note max
    if(note_max_idx !== -1)
    {
        notes = notes.split
        (
            0, 
            note_max_idx
        );
    }


     // octave minimum index
     if(octave_min_idx !== -1)
     {
         octaves = octave.split
         (
             0, 
             octave_min_idx
         );
     }
     
     // split the octave max
     if(octave_max_idx !== -1)
     {
         octaves = octaves.split
         (
             0, 
             octave_max_idx
         );
     }

    var sharp = 
    [
        '',
        '#'
    ];

    // random note and onctave
    var random_note_idx   = Math.floor(Math.random()   * (notes.length-1)) + 1;
    var random_octave_idx = Math.floor(Math.random() * (octaves.length-1)) + 1;

    // create random note
    var random_note = notes[random_note_idx] + octaves[random_octave_idx];

    // add sharp flat or none if desired
    var sharp_flat_none = Math.floor(Math.random() * 3) + 1;
    if(random_sharp === true)
    {

        switch(sharp_flat_none)
        {
            case 1:
                random_note += "#";
                break;
            case 2:
                random_note += "";
                break;
            case 3:
                random_note += "";
                break;
            default:
                break;
        }

    }

    // return the random note
    return random_note;
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Section Generators %%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


// generate a background section
var generateBackgroundSection = function(params)
{

    
    // retrieve items from parameters
    var section_name  = params.section_name;
    var note_sections = params.note_sections;
    var note_length   = params.note_length;
    var repeat_count  = params.repeat_count;
    
    // note length and repeat count
    if(typeof note_length === "undefined")
        note_length = "1/16";
    if(typeof repeat_count === "undefined")
        repeat_count = 0;

    // ensure notes array are in place
    if(Array.isArray(note_sections) !== true)
        return null;

    // return created notes
    var ret_notes = [];



    // iterate through notes
    // add ret note positions
    for(var n = 0; n < repeat_count+1; n++)
    {

        for
        (
            var note_section_iter = 0; 
            note_section_iter < note_sections.length; 
            note_section_iter++
        )
        {

            // set note section
            var note_section = note_sections[note_section_iter];

            // ensure the note section is an array
            if(Array.isArray(note_section) !== true)
                continue;

            // dereference elements
            note       = note_section[0];
            pattern    = note_section[1];
            accent_map = note_section[2];

            // set note
            var new_section_note = 
            {
                notes:      [note],
                pattern:    pattern,
                noteLength: note_length,
                accentMap:  accent_map
            };
        
            // add the new section note
            ret_notes.push(new_section_note);

        }
    }

    // set top level section name here
    if(ret_notes.length > 0)
        ret_notes[0].section = section_name;

    // return the notes
    return ret_notes;
    
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Programatic Note Set Generators %%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// generate all notes between a start and ends (for testing soundfonts)
var generateAllNotesBetween = function(note_start, note_end, include_sharp = true)
{


    if(note_start.length < 2)
    {
        console.log("Note start must be at least 2 chars.");
        return null;
    }
    if(note_end.length < 2)
    {
        console.log("Note end must be at least 2 chars.");
        return null;
    }


    // notes
    var notes = 
    [
        "c",
        "b",
        "a",
        "g",
        "f",
        "e",
        "d"
    ];

    // octaves
    var octaves = 
    [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8"
    ];

    var ret_notes = [];
    
    var start_adding_notes = false;
    var stop_adding_notes = false;

    // iterate through notes and octaves
    octaves.forEach(function(octave)
    {

        // exit immediately if we're to stop adding
        if(stop_adding_notes === true)
            return;

        // iterate through each octave
        notes.forEach(function(note)
        {
            var curr_note_str = note+octave;

            // set note marker
            if(curr_note_str === note_start)
                start_adding_notes = true;

            if(curr_note_str === note_end)
            {
                stop_adding_notes = true;
                return;
            }

            // return indicating we don't want to start adding notes
            if(start_adding_notes !== true)
                return false;

            // create note
            ret_notes.push(createNote
            (
                note,
                octave
            ));

            // add sharp note if set to true
            if(include_sharp === true)
            {

                // create note
                ret_notes.push(createNote
                (
                    note,
                    octave,
                    true
                ));

            }

            

        });

    });

    // return the ret notes
    return ret_notes;

}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%% Note Creator %%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// create a note
var createNote = function(note, octave, sharp = false, note_length = "1/16", pattern = "x")
{

    var note_array = [];
    var note_tmp = note+octave;
    if(sharp === true)
        note_tmp += "#";


    // add note as lowercase
    note_array.push(note_tmp.toLowerCase());
    var note = 
    {
        notes: note_array,
        pattern: pattern,
        noteLength: note_length
    };

    return  note;
    
}


// export the note generator
module.exports.generateRandomBackgroundSection = generateRandomBackgroundSection;
module.exports.generateRandomNote        = generateRandomNote;
module.exports.generateBackgroundSection = generateBackgroundSection;
module.exports.addEmptySectionsToNotes   = addEmptySectionsToNotes;
module.exports.addEmptySectionToNotes    = addEmptySectionToNotes;
module.exports.generateEmptyNotes        = generateEmptyNotes;
module.exports.createNote                = createNote;
module.exports.generateAllNotesBetween   = generateAllNotesBetween;