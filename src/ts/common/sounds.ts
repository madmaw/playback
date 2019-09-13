interface Sound {
    (): void;
}

const dtmfSoundFactory = (
    audioContext: AudioContext,
    frequency1: number, 
    frequency2: number, 
    durationSeconds: number, 
) => {
    return () => {
        const now = audioContext.currentTime;
        const end = now + durationSeconds;
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        osc1.frequency.value = frequency1;
        osc2.frequency.value = frequency2;

        const gain = audioContext.createGain();
        gain.gain.value = .1;

        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 8000;

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
    return () => {
        let now = audioContext.currentTime;
        let oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(oscillatorStartFrequency, now);
        oscillator.frequency.linearRampToValueAtTime(oscillatorEndFrequency, now + durationSeconds);
        oscillator.type = oscillatorType;

        let gain = audioContext.createGain();
        let decay = durationSeconds * .2;
        linearRampGain(gain, now, attackVolume, sustainVolume, attackSeconds, decay, null, durationSeconds);

        let vibrato: OscillatorNode;
        let vibratoGain: GainNode;
        let filter: BiquadFilterNode;
        if( vibratoType ) {
            vibrato = audioContext.createOscillator();
            vibrato.frequency.value = vibratoFrequency;
            vibrato.type = vibratoType;
    
            vibratoGain = audioContext.createGain();
            vibratoGain.gain.value = -999;
    
            vibrato.connect(vibratoGain);
            vibratoGain.connect(oscillator.detune);

            vibrato.start();
            vibrato.stop(now + durationSeconds);
        }

        if( filterFrequency ) {
            filter = audioContext.createBiquadFilter();
            filter.type = filterFrequency < oscillatorStartFrequency
                ? 'highpass'
                : 'lowpass';
            filter.Q.value = 0;
            filter.frequency.value = filterFrequency;    
            oscillator.connect(filter);
            filter.connect(gain);
        } else {
            oscillator.connect(gain);
        }



        //gain.connect(vibratoGain);
        gain.connect(audioContext.destination);

        oscillator.start();    
        oscillator.stop(now + durationSeconds);
        oscillator.onended = () => {
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

const boomSoundFactory =(
    audioContext: AudioContext, 
    durationSeconds: number, 
    attackSeconds: number, 
    filterFrequency: number, 
    attackVolume: number, 
    sustainVolume: number
): Sound => {
	let sampleRate = audioContext.sampleRate;
    let frameCount = durationSeconds * sampleRate | 0;
    let buffer = audioContext.createBuffer(1, frameCount, sampleRate);
	let data = buffer.getChannelData(0);
	
    while (frameCount--) {
        data[frameCount] = Math.random() * 2 - 1;
    }

    return () => {

		let staticNode = audioContext.createBufferSource();
		staticNode.buffer = buffer;
		staticNode.loop = true;

		let filter = audioContext.createBiquadFilter();
		filter.type = 'lowpass';
		filter.Q.value = 0;
		filter.frequency.value = filterFrequency;

		//decay
		let gain = audioContext.createGain();
		let decay = durationSeconds * .2;
		linearRampGain(gain, audioContext.currentTime, attackVolume, sustainVolume, attackSeconds, decay, null, durationSeconds);

		staticNode.connect(filter);
		filter.connect(gain);
		gain.connect(audioContext.destination);
		
		staticNode.start();
		staticNode.stop(audioContext.currentTime + durationSeconds);
		staticNode.onended = () => {
			if( FLAG_MINIMAL_AUDIO_CLEANUP ) {
				audioDisconnectSingleNode(gain);
			} else {
				[gain, staticNode, filter].map(audioDisconnectSingleNode);
			}
		}
    }
}

const SECONDS_PER_LETTER = .2;
const synthesizeSpeech = (
    audioContext: AudioContext, 
    word: string, 
    baseVolume: number, 
) => {
    // create the buffer
    let durationSeconds = word.length * SECONDS_PER_LETTER;
	let sampleRate = audioContext.sampleRate;
    let frameCount = durationSeconds * sampleRate | 0;
    let buffer = audioContext.createBuffer(1, frameCount, sampleRate * 2);
    let data = buffer.getChannelData(0);
    
    SynthSpeech(data, word, sampleRate);

    return () => {
		let staticNode = audioContext.createBufferSource();
        staticNode.buffer = buffer;
        
        let gain = audioContext.createGain();
        gain.gain.value = baseVolume;

        staticNode.connect(gain);
        gain.connect(audioContext.destination);

		staticNode.start();
		staticNode.stop(audioContext.currentTime + durationSeconds);
		staticNode.onended = () => {
			if( FLAG_MINIMAL_AUDIO_CLEANUP ) {
				audioDisconnectSingleNode(gain);
			} else {
				[gain, staticNode].map(audioDisconnectSingleNode);
			}
		}
    };
}