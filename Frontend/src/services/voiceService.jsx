// Voice recognition using Web Speech API
class VoiceService {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        
        // Check browser support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
        }
    }

    /* Check if voice is supported */
    isSupported() {
        return this.recognition !== null;
    }

    /* Start listening for voice input */
    startListening(onResult, onError) {
        if (!this.recognition) {
            onError('Voice recognition not supported in this browser');
            return;
        }

        this.isListening = true;

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            onError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };

        this.recognition.start();
    }

    /* Stop listening */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    /* AI speaks the question (text to speech) */
    speak(text, onEnd) {
        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;  // Slightly slower for clarity
        utterance.pitch = 1;
        utterance.volume = 1;
        
        if (onEnd) {
            utterance.onend = onEnd;
        }

        this.synthesis.speak(utterance);
    }

    /* Stop speaking */
    stopSpeaking() {
        this.synthesis.cancel();
    }
}

export default new VoiceService();