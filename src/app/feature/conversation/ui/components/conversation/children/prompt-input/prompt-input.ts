import {ChangeDetectionStrategy, Component, model, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-prompt-input',
  imports: [FormsModule, NgOptimizedImage],
  templateUrl: './prompt-input.html',
  styleUrl: './prompt-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptInput {
  public onPromptSubmit = output<string>();
  public inputValue = model('');
  public isListening = signal(false);

  private recognition: any;
  private isSpeechRecognitionSupported = false;

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.isSpeechRecognitionSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'de-DE'; // Deutsch, kann angepasst werden

      this.recognition.onstart = () => {
        this.isListening.set(true);
        console.log('Spracherkennung gestartet');
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Erkannter Text:', transcript);
        this.inputValue.set(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Spracherkennungsfehler:', event.error);
        this.isListening.set(false);
      };

      this.recognition.onend = () => {
        this.isListening.set(false);
        console.log('Spracherkennung beendet');
      };
    } else {
      console.warn('Web Speech API wird von diesem Browser nicht unterstützt');
    }
  }

  protected handleInputEnter() {
    if (this.inputValue().length > 0) {
      this.onPromptSubmit.emit(this.inputValue());
      this.inputValue.set('');
    }
  }

  public enableVoice() {
    if (!this.isSpeechRecognitionSupported) {
      alert('Spracherkennung wird von Ihrem Browser nicht unterstützt. Bitte verwenden Sie Chrome, Edge oder Safari.');
      return;
    }

    if (this.isListening()) {
      // Stoppe die Aufnahme
      this.recognition.stop();
      this.onPromptSubmit.emit(this.inputValue());
    } else {
      // Starte die Aufnahme
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Fehler beim Starten der Spracherkennung:', error);
      }
    }
  }
}
