// ---------------------------------------------------------------------------
//
//    tss.js -- Tiny Speech Synthesizer in JavaScript
//
//    Original code: stan_1901 (Andrey Stephanov)
//    http://pouet.net/prod.php?which=50530
//
//    JavaScript port: losso/code red (Alexander Grupe)
//    http://heckmeck.de/demoscene/tiny-speech-synth-js/
//
// ---------------------------------------------------------------------------

const Sawtooth = ( x: number ) => {
	return ( 0.5 - ( x - Math.floor ( x / (Math.PI * 2) ) * Math.PI * 2 ) / (Math.PI * 2) );
}

type Phenome = [number, number, number, number, number, number, number, number, number?, number?];

/*var g_phonemes = {
	'o': { f:[12,  15,  0], w:[ 10,  10,  0], len:3, amp: 6, osc:0, plosive:0 },
	'i': { f:[ 5,  56,  0], w:[ 10,  10,  0], len:3, amp: 3, osc:0, plosive:0 },
	'j': { f:[ 5,  56,  0], w:[ 10,  10,  0], len:1, amp: 3, osc:0, plosive:0 },
	'u': { f:[ 5,  14,  0], w:[ 10,  10,  0], len:3, amp: 3, osc:0, plosive:0 },
	'a': { f:[18,  30,  0], w:[ 10,  10,  0], len:3, amp:15, osc:0, plosive:0 },
	'e': { f:[14,  50,  0], w:[ 10,  10,  0], len:3, amp:15, osc:0, plosive:0 },
	'E': { f:[20,  40,  0], w:[ 10,  10,  0], len:3, amp:12, osc:0, plosive:0 },
	'w': { f:[ 3,  14,  0], w:[ 10,  10,  0], len:3, amp: 1, osc:0, plosive:0 },
	'v': { f:[ 2,  20,  0], w:[ 20,  10,  0], len:3, amp: 3, osc:0, plosive:0 },
	'T': { f:[ 2,  20,  0], w:[ 40,   1,  0], len:3, amp: 5, osc:0, plosive:0 },
	'z': { f:[ 5,  28, 80], w:[ 10,   5, 10], len:3, amp: 3, osc:0, plosive:0 },
	'Z': { f:[ 4,  30, 60], w:[ 50,   1,  5], len:3, amp: 5, osc:0, plosive:0 },
	'b': { f:[ 4,   0,  0], w:[ 10,   0,  0], len:1, amp: 2, osc:0, plosive:0 },
	'd': { f:[ 4,  40, 80], w:[ 10,  10, 10], len:1, amp: 2, osc:0, plosive:0 },
	'm': { f:[ 4,  20,  0], w:[ 10,  10,  0], len:3, amp: 2, osc:0, plosive:0 },
	'n': { f:[ 4,  40,  0], w:[ 10,  10,  0], len:3, amp: 2, osc:0, plosive:0 },
	'r': { f:[ 3,  10, 20], w:[ 30,   8,  1], len:3, amp: 3, osc:0, plosive:0 },
	'l': { f:[ 8,  20,  0], w:[ 10,  10,  0], len:3, amp: 5, osc:0, plosive:0 },
	'g': { f:[ 2,  10, 26], w:[ 15,   5,  2], len:2, amp: 1, osc:0, plosive:0 },
	'f': { f:[ 8,  20, 34], w:[ 10,  10, 10], len:3, amp: 4, osc:1, plosive:0 },
	'h': { f:[22,  26, 32], w:[ 30,  10, 30], len:1, amp:10, osc:1, plosive:0 },
	's': { f:[80, 110,  0], w:[ 80,  40,  0], len:3, amp: 5, osc:1, plosive:0 },
	'S': { f:[20,  30,  0], w:[100, 100,  0], len:3, amp:10, osc:1, plosive:0 },
	'p': { f:[ 4,  10, 20], w:[  5,  10, 10], len:1, amp: 2, osc:1, plosive:1 },
	't': { f:[ 4,  20, 40], w:[ 10,  20,  5], len:1, amp: 3, osc:1, plosive:1 },
	'k': { f:[20,  80,  0], w:[ 10,  10,  0], len:1, amp: 3, osc:1, plosive:1 }
};
*/
var g_phonemes: {[_:string]: Phenome} = {
	'o': [12,  15,  0, 10,  10,  0, 3, 6],
	'i': [ 5,  56,  0, 10,  10,  0, 3, 3],
	'j': [ 5,  56,  0, 10,  10,  0, 1, 3],
	'u': [ 5,  14,  0, 10,  10,  0, 3, 3],
	'a': [18,  30,  0, 10,  10,  0, 3, 5],
	'e': [14,  50,  0, 10,  10,  0, 3, 15],
	//'E': [20,  40,  0, 10,  10,  0, 3, 12],
	'w': [ 3,  14,  0, 10,  10,  0, 3, 1],
	'v': [ 2,  20,  0, 20,  10,  0, 3, 3],
	//'T': [ 2,  20,  0, 40,   1,  0, 3, 5],
	'z': [ 5,  28, 80, 10,   5, 10, 3, 3],
	//'Z': [ 4,  30, 60, 50,   1,  5, 3, 5],
	'b': [ 4,   0,  0, 10,   0,  0, 1, 2],
	'd': [ 4,  40, 80, 10,  10, 10, 1, 2],
	'm': [ 4,  20,  0, 10,  10,  0, 3, 2],
	'n': [ 4,  40,  0, 10,  10,  0, 3, 2],
	'r': [ 3,  10, 20, 30,   8,  1, 3, 3],
	'l': [ 8,  20,  0, 10,  10,  0, 3, 5],
	'g': [ 2,  10, 26, 15,   5,  2, 2, 1],
	'f': [ 8,  20, 34, 10,  10, 10, 3, 4, 1],
	'h': [22,  26, 32, 30,  10, 30, 1, 10, 1],
	's': [80, 110,  0, 80,  40,  0, 3, 5, 1],
	//'S': [20,  30,  0, 100, 100,  0, 3, 10, 1],
	'p': [ 4,  10, 20,   5,  10, 10, 1,  2, 1, 1 ],
	't': [ 4,  20, 40,  10,  20,  5, 1, 3, 1, 1 ],
	'k': [20,  80,  0, 10,  10,  0, 1, 3, 1, 1 ], 
};


const OFFSET_W = 3;
const INDEX_LEN = 6;
const INDEX_AMP = 7;
const INDEX_OSC = 8;
const INDEX_PLOSIVE = 9;


// Synthesizes speech and adds it to specified buffer
const SynthSpeech = ( buf: Float32Array, text: string, f0: number, speed: number, bufPos: number, sampleFrequency: number ) => {
	// Loop through all phonemes
	for (var textPos=0; textPos<text.length; textPos++) {
		var l = text.charAt(textPos);
		// Find phoneme description
		var p = g_phonemes[l];
		if (!p) {
			if (l == " ") {
				bufPos += Math.floor(sampleFrequency * 0.2 * speed);
			}
			continue;
		}
		var v = p[INDEX_AMP];
		// Generate sound
		var sl = p[INDEX_LEN] * (sampleFrequency / 15) * speed;
		for ( var f = 0; f < 3; f++ ) {
			var ff = p[f];
			var freq = ff*(50/sampleFrequency);
			if ( !ff )
				continue;
			var buf1Res = 0, buf2Res = 0;
			var q = 1.0 - p[f + OFFSET_W] * (Math.PI * 10 / sampleFrequency);
			//var b = buf; <-- store current bufPos?
			var thisBufPos = bufPos;
			var xp = 0;
			for ( var s = 0; s < sl; s++ ) {
				var n = Math.random()-0.5;
				var x = n;
				if ( !p[INDEX_OSC] ) {
					x = Sawtooth ( s * (f0 * Math.PI * 2 / sampleFrequency) );
					xp = 0;
				}
				// Apply formant filter
				x = x + 2 * Math.cos ( Math.PI * 2 * freq ) * buf1Res * q - buf2Res * q * q;
				buf2Res = buf1Res;
				buf1Res = x;
				x = 0.75 * xp + x * v;
				xp = x;
                x = x/128 - 1;
				buf[thisBufPos++] = buf[thisBufPos]/2+x;
				buf[thisBufPos++] = buf[thisBufPos]/2+x;
			}
		}
		// Overlap neighbour phonemes
		bufPos += ((3*sl/4)<<1);
		if ( p[INDEX_PLOSIVE] )
			bufPos += (sl&0xfffffe);
	}
}