export type RecorderType = {
	mediaRecorder: MediaRecorder | null;
	start: () => void;
	end: () => void;
};

export const Recorder = async (
	selectedDevice: string,
	cb: (blob: Blob) => void
): Promise<RecorderType | null> => {
	let stream: MediaStream | null = null;

	let mediaRecorder: MediaRecorder;
	let audioChunks: Blob[] = [];
	let audioBlob: Blob = new Blob();

	function startRecording() {
		if (!mediaRecorder) return;
		try {
			mediaRecorder.start();
		} catch (error) {
			console.log(error);
		}
	}

	function stopRecording() {
		if (!mediaRecorder) return;
		try {
			mediaRecorder.stop();
		} catch (error) {
			console.log(error);
		}
	}

	async function handleRecorderStop() {
	

		audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });

		audioChunks = [];

		cb(audioBlob);
	}

	try {
		if (typeof window === 'undefined') return null;

		stream = await navigator.mediaDevices.getUserMedia({
			audio: {
				deviceId: {
					exact: selectedDevice
				}
			}
		});


		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.onstop = handleRecorderStop;
		mediaRecorder.ondataavailable = (e) => {
			audioChunks.push(e.data);
		};

		return { mediaRecorder, start: startRecording, end: stopRecording };
	} catch (error) {
		console.error(`The following getUserMedia error occurred: ${error}`);
		return null;
	}
};
