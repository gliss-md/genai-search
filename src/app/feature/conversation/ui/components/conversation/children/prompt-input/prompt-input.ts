import {ChangeDetectionStrategy, Component, effect, inject, model, output, signal} from '@angular/core';
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

  public onPromptSubmit = output<string>();
  public inputValue = model('');
  public isListening = this.speechApiService.isListening;

  constructor() {
    this.speechApiService.initializeSpeechRecognition();
    effect(() => {
      this.speechApiService.transcriptResult() !== '' ? this.onPromptSubmit.emit(this.speechApiService.transcriptResult()) : void 0;
    });
  }

  protected handleInputEnter() {
    if (this.inputValue().length > 0) {
      this.onPromptSubmit.emit(this.inputValue());
      this.inputValue.set('');
    }
  }
  public enableVoice() {
    this.speechApiService.enableVoice()
  }
}
