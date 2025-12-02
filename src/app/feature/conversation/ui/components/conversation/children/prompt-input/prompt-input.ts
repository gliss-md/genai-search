import {ChangeDetectionStrategy, Component, effect, inject, model, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {SpeechApiService} from './speech-api-service';

@Component({
  selector: 'app-prompt-input',
  imports: [FormsModule, NgOptimizedImage],
  templateUrl: './prompt-input.html',
  styleUrl: './prompt-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptInput {
  private speechApiService = inject(SpeechApiService);

  public promptSubmit = output<string>();
  public inputValue = model('');
  public isListening = this.speechApiService.isListening;

  constructor() {
    this.speechApiService.initializeSpeechRecognition();
    effect(() => {
      if (this.speechApiService.transcriptResult() !== '') {
        this.promptSubmit.emit(this.speechApiService.transcriptResult())
      }
    });
  }

  protected handleInputEnter() {
    if (this.inputValue().length > 0) {
      this.promptSubmit.emit(this.inputValue());
      this.inputValue.set('');
    }
  }

  public enableVoice() {
    this.speechApiService.enableVoice()
  }
}
