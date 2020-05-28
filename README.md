# SongBuilderJS
Create multi-track songs, and complete albums using nothing but nodejs.

This was a project I created about 2 years ago (2018) when I was experimenting with generating procedural music.  I've decided to release it now as it's a fun bit of code, and I think it works well enough for people to use.

# Binary Dependencies

timidity (apt-get install timidity)

sox      (apt-get install sox)

Timidity is used for converting midi files to wav files, and sox is used for playing wav files over the command line.

# NodeJS Dependencies

jsmidgen     (npm install --save jsmidgen)

node-run-cmd (npm install --save node-run-cmd)

scribbletune (npm install --save scribbletune)

# Platform

This software was designed to work in a Linux environment, using nodejs 10+.

# API Stability

This API was designed quite a long time ago, and my code style has changed over the years.  Updates to this code will likely result in API interface changes, but nothing too major that won't require simple code fixes.  It's mostly finished as is, but I can see myself wanting to change from method parameters, to object parameters for example.  I may also modify some of the code to be async instead of it's current synchronous pattern, as when I wrote this I wasn't particularly good with the async pattern.

It's near 100% likely that I'll be rewriting most of the code here using classes for the next release version.
