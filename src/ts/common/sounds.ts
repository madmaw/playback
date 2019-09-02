interface Sound {
    (emphasis: number, say?: boolean | number, speedMultiplier?: number): void;
}

const dtmfSoundFactory = (
    audioContext: AudioContext,
    frequency1: number, 
    frequency2: number, 
    durationSeconds: number, 
) => {
    return (emphasis: number, say?: boolean | number, speedMultiplier: number = 1) => {
        const now = audioContext.currentTime;
        const end = now + durationSeconds * speedMultiplier;
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        osc1.frequency.value = frequency1/(speedMultiplier*emphasis);
        osc2.frequency.value = frequency2/(speedMultiplier*emphasis);

        const gain = audioContext.createGain();
        gain.gain.value = emphasis/9;

        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 8000/speedMultiplier;

        osc1.connect(gain);
        osc2.connect(gain);

        gain.connect(filter);
        filter.connect(audioContext.destination);
        osc1.start();
        osc2.start();
        osc1.stop(end);
        osc2.stop(end);
        osc1.onended = () => {
            
            if( !FLAG_MINIMAL_AUDIO_CLEANUP ) {
                [osc1, osc2, gain, filter].map(audioDisconnectSingleNode);
            } else {
                [gain].map(audioDisconnectSingleNode);
            }
        }
    };
}

let vibratoSoundFactory = (
    audioContext: AudioContext,
    durationSeconds: number,
    attackSeconds: number,
    attackVolume: number,
    sustainVolume: number, 
    oscillatorType: OscillatorType, 
    oscillatorStartFrequency: number,
    oscillatorEndFrequency: number,
    filterFrequency?: number,
    vibratoType?: OscillatorType,
    vibratoFrequency?: number
) => {
    return (emphasis: number, say?: boolean | number, speedMultiplier: number = 1) => {
        let now = audioContext.currentTime;
        let oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(oscillatorStartFrequency/speedMultiplier, now);
        oscillator.frequency.linearRampToValueAtTime(oscillatorEndFrequency/speedMultiplier, now + durationSeconds * speedMultiplier);
        oscillator.type = oscillatorType;

        let gain = audioContext.createGain();
        var decay = durationSeconds * .2 * speedMultiplier;
        linearRampGain(gain, now, attackVolume * emphasis, sustainVolume * emphasis, attackSeconds * speedMultiplier, decay, null, durationSeconds * speedMultiplier);

        let vibrato: OscillatorNode;
        let vibratoGain: GainNode;
        if( vibratoType ) {
            vibrato = audioContext.createOscillator();
            vibrato.frequency.value = vibratoFrequency / speedMultiplier;
            vibrato.type = vibratoType;
    
            vibratoGain = audioContext.createGain();
            vibratoGain.gain.value = -999;
    
            vibrato.connect(vibratoGain);
            vibratoGain.connect(oscillator.detune);

            vibrato.start();
            vibrato.stop(now + durationSeconds);
        }

        if( filterFrequency ) {
            var filter = audioContext.createBiquadFilter();
            filter.type = filterFrequency < oscillatorStartFrequency
                ? 'highpass'
                : 'lowpass';
            filter.Q.value = 0;
            filter.frequency.value = filterFrequency/speedMultiplier;    
            oscillator.connect(filter);
            filter.connect(gain);
        } else {
            oscillator.connect(gain);
        }



        //gain.connect(vibratoGain);
        gain.connect(audioContext.destination);

        oscillator.start();    
        oscillator.stop(now + durationSeconds);
        oscillator.onended = function() {
            if( !FLAG_MINIMAL_AUDIO_CLEANUP ) {
                [oscillator, gain, vibrato, vibratoGain, filter].map(audioDisconnectSingleNode);
            } else {
                [gain].map(audioDisconnectSingleNode);
            }
        }
    }    
};

const audioDisconnectSingleNode = (node: AudioNode) => {
    if( node ) {
        node.disconnect();
    }
}

const linearRampGain = (gain: GainNode, now: number, attackVolume: number, sustainVolume, attackSeconds: number, decaySeconds: number, sustainSeconds:number, durationSeconds: number) => {
    gain.gain.value = 0;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(attackVolume, now + attackSeconds);
    gain.gain.linearRampToValueAtTime(sustainVolume, now + decaySeconds);
    if (sustainSeconds) {
        gain.gain.linearRampToValueAtTime(sustainVolume, now + sustainSeconds);
    }
    gain.gain.linearRampToValueAtTime(0, now + durationSeconds);
}

function boomSoundFactory(
    audioContext: AudioContext, 
    durationSeconds: number, 
    attackSeconds: number, 
    filterFrequency: number, 
    attackVolume: number, 
    sustainVolume: number
): Sound {
	let sampleRate = audioContext.sampleRate;
    var frameCount = durationSeconds * sampleRate | 0;
    var buffer = audioContext.createBuffer(1, frameCount, sampleRate);
	var data = buffer.getChannelData(0);
	
    while (frameCount--) {
        data[frameCount] = Math.random() * 2 - 1;
    }

    return (volume: number, say?: boolean | number, speedMultiplier: number = 1) => {

		var staticNode = audioContext.createBufferSource();
		staticNode.buffer = buffer;
		staticNode.loop = true;

		var filter = audioContext.createBiquadFilter();
		filter.type = 'lowpass';
		filter.Q.value = 0;
		filter.frequency.value = filterFrequency;

		//decay
		var gain = audioContext.createGain();
		var decay = durationSeconds * .2;
		linearRampGain(gain, audioContext.currentTime, attackVolume * volume, sustainVolume * volume, attackSeconds, decay, null, durationSeconds);

		staticNode.connect(filter);
		filter.connect(gain);
		gain.connect(audioContext.destination);
		
		staticNode.start();
		staticNode.stop(audioContext.currentTime + durationSeconds);
		staticNode.onended = function() {
			if( FLAG_MINIMAL_AUDIO_CLEANUP ) {
				audioDisconnectSingleNode(gain);
			} else {
				[gain, staticNode, filter].map(audioDisconnectSingleNode);
			}
		}
    }
}

const PHENOMES: {[_:string]: [number, number, number, number, number, number?]} = {o:[52,55,10,10,6],i:[45,96,10,10,3],j:[45,96,10,10,3],u:[45,54,10,10,3],a:[58,70,10,10,15],e:[54,90,10,10,15],E:[60,80,10,10,12],w:[43,54,10,10,1],v:[42,60,20,10,3],T:[42,60,40,1,5],z:[45,68,10,5,3],Z:[44,70,50,1,5],b:[44,44,10,10,2],d:[44,99,10,10,2],m:[44,60,10,10,2],n:[44,99,10,10,2],r:[43,50,30,8,3],l:[48,60,10,10,5],g:[42,50,15,5,1],f:[48,60,10,10,4,1],h:[62,66,30,10,10,1],s:[120,150,80,40,5,1],S:[20,70,99,99,10,1],p:[44,50,5,10,2,1],t:[44,60,10,20,3,1],k:[60,99,10,10,6,1]};
const SECONDS_PER_LETTER = .2;
const synthesizeSpeech = (
    audioContext: AudioContext, 
    word: string, 
    baseVolume: number, 
) => {
    // create the buffer
    let durationSeconds = word.length * SECONDS_PER_LETTER;
	let sampleRate = audioContext.sampleRate;
    var frameCount = durationSeconds * sampleRate | 0;
    var buffer = audioContext.createBuffer(1, frameCount, sampleRate);
    var data = buffer.getChannelData(0);
    
    SynthSpeech(data, word, 60, 1, 0, sampleRate);

    return (volume: number) => {
		var staticNode = audioContext.createBufferSource();
        staticNode.buffer = buffer;
        
        var gain = audioContext.createGain();
        gain.gain.value = volume * baseVolume;

        staticNode.connect(gain);
        gain.connect(audioContext.destination);

		staticNode.start();
		staticNode.stop(audioContext.currentTime + durationSeconds);
		staticNode.onended = function() {
			if( FLAG_MINIMAL_AUDIO_CLEANUP ) {
				audioDisconnectSingleNode(gain);
			} else {
				[gain, staticNode].map(audioDisconnectSingleNode);
			}
		}
    };
}