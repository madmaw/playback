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
	return ( .5 - ( x - Math.floor ( x / MATH_PI_2 ) * MATH_PI_2 ) / MATH_PI_2 );
}

type Phenome = [number, number, number, number, number?, number?, number?, number?, number?, number?];

/*let g_phonemes = {
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
let g_phonemes: Phenome[];
if (FLAG_RANDOMIZE_PHENOMES) {
	g_phonemes = [];
	for (let i=0; i<26; i++) {
		const a = Math.random();
		const b = Math.random();
		const c = Math.random();
		const d = Math.random();
		const e = Math.random();

		g_phonemes[i] = [a * a * 20, b, c, d, e].map(v => v | 0) as Phenome;
	}
} else {
	g_phonemes = [
		[10,  10,  0, 18,  30], // 'a': 
		,//[10,   0,  0, 4], // 'b': 
		, // c
		[10,  10, 10, 4,  40, 80], // 'd': 
		[10,  10,  0, 14,  50], // 'e': 
		[10,  10, 10, 8,  20, 34], // 'f': 
		[15,   5,  2,  2,  10, 26], // 'g': 
		[30,  10, 30, 22,  26, 32], // 'h': 
		[10,  10,  0,  5,  56], // 'i': 
		[10,  10,  0,  5,  56], // 'j': 
		,//[10,  10,  0, 20,  80], //'k': 
		,//[10,  10,  0,  8,  20], // 'l': 
		,//[10,  10,  0,  4,  20], // 'm': 
		[10,  10,  0,  4,  40], //'n': 
		[10,  10,  0, 12,  15], // 'o': 
		[ 5,  10, 10,  4,  10, 20], // 'p': 
		,// q
		[30,   8,  1,  3,  10, 20], // 'r': 
		[80,  40,  0, 80, 110], // 's': 
		[10,  20,  5,  4,  20, 40], // 't': 
		[10,  10,  0,  5,  14], // 'u': 
		//[20,  10,  0,  2,  20], // 'v': 
		//[ 3,  14,  0, 10,  10,  0, 3, 1], // 'w': // unused?
		//, // x
		//, // y
		//[ 5,  28, 80, 10,   5, 10, 3, 3], // 'z': // unused?
	];	
}


const OFFSET_F = 3;
// const INDEX_LEN = 6;
// const INDEX_AMP = 7;
// const INDEX_OSC = 8;
// const INDEX_PLOSIVE = 9;


// Synthesizes speech and adds it to specified buffer
const SynthSpeech = ( buf: Float32Array, text: string, sampleFrequency: number ) => {
	let bufPos = 0;
	// Loop through all phonemes
	text.split('').forEach((c, textPos) => {
		let l = text.charCodeAt(textPos) - 97; // (a is 97)
		// Find phoneme description
		let p = g_phonemes[l];
		if (!p) {
			// space
			if (l == 32) {
				bufPos += (sampleFrequency * .2) | 0;
			}
		} else {
		//let v = p[INDEX_AMP];
		let v = 3;
		// Generate sound
		//let sl = p[INDEX_LEN] * (sampleFrequency / 15);
		let sl = (2+l/9) * (sampleFrequency / 15);
		for ( let f = 0; f < 3; f++ ) {
			let ff = p[f + OFFSET_F];
			if ( ff ) {
				let freq = ff*(30/sampleFrequency);
				let buf1Res = 0, buf2Res = 0;
				let q = 1 - p[f] * (MATH_PI_2 * 5 / sampleFrequency);
				//let b = buf; <-- store current bufPos?
				let thisBufPos = bufPos;
				let xp = 0;
				for ( let s = 0; s < sl; s++ ) { 
					// let n = Math.random()-.5;
					// let x = n;
					// if ( !p[INDEX_OSC] ) {
						let x = Sawtooth ( s * (60 * MATH_PI_2 / sampleFrequency) );
						// xp = 0;
					// }
					// Apply formant filter
					x += 2 * Math.cos ( MATH_PI_2 * freq ) * buf1Res * q - buf2Res * q * q;
					buf2Res = buf1Res;
					buf1Res = x;
					x = .75 * xp + x * v;
					xp = x;
					x = x/128 - 1;
					buf[thisBufPos++] = buf[thisBufPos]/2+x;
					buf[thisBufPos++] = buf[thisBufPos]/2+x;
				}	
			}
		}
		// Overlap neighbour phonemes
		bufPos += ((3*sl/4)<<1);
		// if ( p[INDEX_PLOSIVE] )
		// 	bufPos += (sl&0xfffffe);
		}
	});
}