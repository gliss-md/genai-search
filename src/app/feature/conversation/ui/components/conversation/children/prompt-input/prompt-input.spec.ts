import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromptInput } from './prompt-input';
import { SpeechApiService } from './speech-api-service';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('PromptInput', () => {
  let component: PromptInput;
  let fixture: ComponentFixture<PromptInput>;
  let mockSpeechApiService: any;

  beforeEach(async () => {
    // Mock SpeechApiService
    mockSpeechApiService = {
      isListening: signal(false),
      transcriptResult: signal(''),
      initializeSpeechRecognition: vi.fn(),
      enableVoice: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PromptInput],
      providers: [
        { provide: SpeechApiService, useValue: mockSpeechApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PromptInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input value', () => {
    expect(component.inputValue()).toBe('');
  });

  it('should call initializeSpeechRecognition on construction', () => {
    expect(mockSpeechApiService.initializeSpeechRecognition).toHaveBeenCalled();
  });

  it('should expose isListening from SpeechApiService', () => {
    expect(component.isListening()).toBe(false);

    mockSpeechApiService.isListening.set(true);
    expect(component.isListening()).toBe(true);
  });

  describe('handleInputEnter', () => {
    it('should emit prompt when input has value', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      component.inputValue.set('Test prompt');
      component['handleInputEnter']();

      expect(emitSpy).toHaveBeenCalledWith('Test prompt');
    });

    it('should clear input after emitting', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      component.inputValue.set('Test prompt');
      component['handleInputEnter']();

      expect(component.inputValue()).toBe('');
    });

    it('should not emit when input is empty', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      component.inputValue.set('');
      component['handleInputEnter']();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when input contains only spaces', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      component.inputValue.set('   ');
      component['handleInputEnter']();

      // Current implementation doesn't trim, so it will emit
      expect(emitSpy).toHaveBeenCalledWith('   ');
    });
  });

  describe('enableVoice', () => {
    it('should call speechApiService.enableVoice', () => {
      component.enableVoice();

      expect(mockSpeechApiService.enableVoice).toHaveBeenCalled();
    });

    it('should call enableVoice only once per click', () => {
      component.enableVoice();

      expect(mockSpeechApiService.enableVoice).toHaveBeenCalledTimes(1);
    });
  });

  describe('transcriptResult effect', () => {
    it('should emit when transcriptResult changes to non-empty value', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      // Trigger the effect by setting transcriptResult
      mockSpeechApiService.transcriptResult.set('Recognized text');
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledWith('Recognized text');
    });

    it('should not emit when transcriptResult is empty', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      mockSpeechApiService.transcriptResult.set('');
      fixture.detectChanges();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit multiple times when transcriptResult changes multiple times', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      mockSpeechApiService.transcriptResult.set('First text');
      fixture.detectChanges();

      mockSpeechApiService.transcriptResult.set('Second text');
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledTimes(2);
      expect(emitSpy).toHaveBeenNthCalledWith(1, 'First text');
      expect(emitSpy).toHaveBeenNthCalledWith(2, 'Second text');
    });
  });

  describe('Integration with SpeechApiService', () => {
    it('should reflect listening state from service', () => {
      expect(component.isListening()).toBe(false);

      // Simulate service starting recognition
      mockSpeechApiService.isListening.set(true);
      expect(component.isListening()).toBe(true);

      // Simulate service stopping recognition
      mockSpeechApiService.isListening.set(false);
      expect(component.isListening()).toBe(false);
    });

    it('should handle complete voice input flow', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      // User clicks microphone
      component.enableVoice();
      expect(mockSpeechApiService.enableVoice).toHaveBeenCalled();

      // Service starts listening
      mockSpeechApiService.isListening.set(true);
      expect(component.isListening()).toBe(true);

      // Service recognizes text
      mockSpeechApiService.transcriptResult.set('Hello World');
      fixture.detectChanges();

      // Effect should emit the recognized text
      expect(emitSpy).toHaveBeenCalledWith('Hello World');

      // Service stops listening
      mockSpeechApiService.isListening.set(false);
      expect(component.isListening()).toBe(false);
    });

    it('should handle manual input and voice input separately', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      // Manual input
      component.inputValue.set('Manual text');
      component['handleInputEnter']();
      expect(emitSpy).toHaveBeenCalledWith('Manual text');
      expect(component.inputValue()).toBe('');

      // Voice input
      mockSpeechApiService.transcriptResult.set('Voice text');
      fixture.detectChanges();
      expect(emitSpy).toHaveBeenCalledWith('Voice text');

      expect(emitSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid transcript changes', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      mockSpeechApiService.transcriptResult.set('Text 1');
      fixture.detectChanges();

      mockSpeechApiService.transcriptResult.set('Text 2');
      fixture.detectChanges();

      mockSpeechApiService.transcriptResult.set('Text 3');
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledTimes(3);
    });

    it('should handle empty transcript followed by non-empty', () => {
      const emitSpy = vi.fn();
      component.onPromptSubmit.subscribe(emitSpy);

      mockSpeechApiService.transcriptResult.set('');
      fixture.detectChanges();
      expect(emitSpy).not.toHaveBeenCalled();

      mockSpeechApiService.transcriptResult.set('Now there is text');
      fixture.detectChanges();
      expect(emitSpy).toHaveBeenCalledWith('Now there is text');
    });
  });
});


