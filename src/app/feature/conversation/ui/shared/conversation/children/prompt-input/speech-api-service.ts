import {Injectable, signal} from '@angular/core';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent {
  readonly error: string;
  readonly message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

@Injectable({
  providedIn: 'root',
})
export class SpeechApiService {

  public isListening = signal(false);
  public transcriptResult = signal('');

  private recognition: SpeechRecognitionInstance | null = null;
  private isSpeechRecognitionSupported = false;

  public initializeSpeechRecognition() {
    const windowWithSR = window as WindowWithSpeechRecognition;
    const SpeechRecognition = windowWithSR.SpeechRecognition || windowWithSR.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.isSpeechRecognitionSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'de-DE'; // Deutsch, kann angepasst werden

      this.recognition.onstart = () => {
        this.isListening.set(true);
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log('Erkannter Text:', transcript);
        this.transcriptResult.set(transcript);
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Spracherkennungsfehler:', event.error);
        this.isListening.set(false);
      };

      this.recognition.onend = () => {
        this.isListening.set(false);
      };
    } else {
      console.warn('Web Speech API wird von diesem Browser nicht unterstützt');
    }
  }

  public enableVoice() {
    if (!this.isSpeechRecognitionSupported || !this.recognition) {
      alert('Spracherkennung wird von Ihrem Browser nicht unterstützt. Bitte verwenden Sie Chrome, Edge oder Safari.');
      return;
    }

    if (this.isListening()) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Fehler beim Starten der Spracherkennung:', error);
      }
    }
  }

}
