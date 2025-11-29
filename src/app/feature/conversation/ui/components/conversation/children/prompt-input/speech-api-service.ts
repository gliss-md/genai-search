import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechApiService {

  public isListening = signal(false);
  public transcriptResult = signal('');

  private recognition: any;
  private isSpeechRecognitionSupported = false;

  public initializeSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.isSpeechRecognitionSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'de-DE'; // Deutsch, kann angepasst werden

      this.recognition.onstart = () => {
        this.isListening.set(true);
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Erkannter Text:', transcript);
        this.transcriptResult.set(transcript);
      };

      this.recognition.onerror = (event: any) => {
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
    if (!this.isSpeechRecognitionSupported) {
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
