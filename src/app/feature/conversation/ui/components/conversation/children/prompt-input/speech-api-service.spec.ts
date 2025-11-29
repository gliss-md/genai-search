import { TestBed } from '@angular/core/testing';
import { SpeechApiService } from './speech-api-service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('SpeechApiService', () => {
  let service: SpeechApiService;
  let mockSpeechRecognition: any;
  let SpeechRecognitionConstructor: any;

  beforeEach(() => {
    // Mock SpeechRecognition instance
    mockSpeechRecognition = {
      continuous: false,
      interimResults: false,
      lang: '',
      onstart: null,
      onresult: null,
      onerror: null,
      onend: null,
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn()
    };

    // Create constructor function
    SpeechRecognitionConstructor = function() {
      return mockSpeechRecognition;
    };

    // Inject mock into window
    (window as any).SpeechRecognition = SpeechRecognitionConstructor;
    (window as any).webkitSpeechRecognition = SpeechRecognitionConstructor;

    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechApiService);
  });

  afterEach(() => {
    // Clean up
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isListening as false', () => {
    expect(service.isListening()).toBe(false);
  });

  it('should initialize with empty transcriptResult', () => {
    expect(service.transcriptResult()).toBe('');
  });

  describe('initializeSpeechRecognition', () => {
    beforeEach(() => {
      service.initializeSpeechRecognition();
    });

    it('should initialize SpeechRecognition with correct settings', () => {
      expect(mockSpeechRecognition.continuous).toBe(false);
      expect(mockSpeechRecognition.interimResults).toBe(false);
      expect(mockSpeechRecognition.lang).toBe('de-DE');
    });

    it('should set isListening to true when recognition starts', () => {
      expect(service.isListening()).toBe(false);

      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }

      expect(service.isListening()).toBe(true);
    });

    it('should set transcriptResult when recognition completes', () => {
      const mockEvent = {
        results: [[{ transcript: 'Hallo Welt' }]]
      };

      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent);
      }

      expect(service.transcriptResult()).toBe('Hallo Welt');
    });

    it('should log the recognized text', () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const mockEvent = {
        results: [[{ transcript: 'Test Text' }]]
      };

      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent);
      }

      expect(consoleLogSpy).toHaveBeenCalledWith('Erkannter Text:', 'Test Text');
      consoleLogSpy.mockRestore();
    });

    it('should set isListening to false when recognition ends', () => {
      // Start recognition first
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      expect(service.isListening()).toBe(true);

      // Trigger onend
      if (mockSpeechRecognition.onend) {
        mockSpeechRecognition.onend();
      }

      expect(service.isListening()).toBe(false);
    });

    it('should handle recognition errors', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Start recognition
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      expect(service.isListening()).toBe(true);

      // Trigger error
      const mockError = { error: 'network' };
      if (mockSpeechRecognition.onerror) {
        mockSpeechRecognition.onerror(mockError);
      }

      expect(service.isListening()).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Spracherkennungsfehler:', 'network');
      consoleErrorSpy.mockRestore();
    });

    it('should handle no-speech error', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }

      const mockError = { error: 'no-speech' };
      if (mockSpeechRecognition.onerror) {
        mockSpeechRecognition.onerror(mockError);
      }

      expect(service.isListening()).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Spracherkennungsfehler:', 'no-speech');
      consoleErrorSpy.mockRestore();
    });
  });

  describe('initializeSpeechRecognition - not supported', () => {
    it('should log warning when SpeechRecognition is not supported', () => {
      // Remove SpeechRecognition
      const originalSpeechRecognition = (window as any).SpeechRecognition;
      const originalWebkit = (window as any).webkitSpeechRecognition;
      delete (window as any).SpeechRecognition;
      delete (window as any).webkitSpeechRecognition;

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      service.initializeSpeechRecognition();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Web Speech API wird von diesem Browser nicht unterstützt'
      );

      consoleWarnSpy.mockRestore();

      // Restore
      (window as any).SpeechRecognition = originalSpeechRecognition;
      (window as any).webkitSpeechRecognition = originalWebkit;
    });
  });

  describe('enableVoice', () => {
    beforeEach(() => {
      service.initializeSpeechRecognition();
    });

    it('should start speech recognition when not listening', () => {
      service.enableVoice();

      expect(mockSpeechRecognition.start).toHaveBeenCalled();
    });

    it('should stop speech recognition when already listening', () => {
      // Start listening
      service.enableVoice();
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      expect(service.isListening()).toBe(true);

      // Stop listening
      service.enableVoice();

      expect(mockSpeechRecognition.stop).toHaveBeenCalled();
    });

    it('should handle start errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSpeechRecognition.start.mockImplementation(() => {
        throw new Error('Recognition already started');
      });

      service.enableVoice();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Fehler beim Starten der Spracherkennung:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });

    it('should show alert when SpeechRecognition is not supported', () => {
      // Set service as unsupported
      (service as any).isSpeechRecognitionSupported = false;

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      service.enableVoice();

      expect(alertSpy).toHaveBeenCalledWith(
        'Spracherkennung wird von Ihrem Browser nicht unterstützt. Bitte verwenden Sie Chrome, Edge oder Safari.'
      );

      alertSpy.mockRestore();
    });

    it('should not start recognition when not supported', () => {
      (service as any).isSpeechRecognitionSupported = false;
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      service.enableVoice();

      expect(mockSpeechRecognition.start).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });
  });

  describe('Integration tests', () => {
    it('should complete full speech recognition flow', () => {
      // Initialize
      service.initializeSpeechRecognition();

      // Start recognition
      service.enableVoice();
      expect(mockSpeechRecognition.start).toHaveBeenCalled();

      // Simulate start
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      expect(service.isListening()).toBe(true);

      // Simulate result
      const mockEvent = {
        results: [[{ transcript: 'Integration Test' }]]
      };
      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent);
      }
      expect(service.transcriptResult()).toBe('Integration Test');

      // Simulate end
      if (mockSpeechRecognition.onend) {
        mockSpeechRecognition.onend();
      }
      expect(service.isListening()).toBe(false);
    });

    it('should handle multiple recognition cycles', () => {
      service.initializeSpeechRecognition();

      // First cycle
      service.enableVoice();
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      const mockEvent1 = {
        results: [[{ transcript: 'First message' }]]
      };
      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent1);
      }
      expect(service.transcriptResult()).toBe('First message');
      if (mockSpeechRecognition.onend) {
        mockSpeechRecognition.onend();
      }

      // Second cycle
      service.enableVoice();
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      const mockEvent2 = {
        results: [[{ transcript: 'Second message' }]]
      };
      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent2);
      }
      expect(service.transcriptResult()).toBe('Second message');
      if (mockSpeechRecognition.onend) {
        mockSpeechRecognition.onend();
      }
    });

    it('should handle user interruption', () => {
      service.initializeSpeechRecognition();

      // Start recognition
      service.enableVoice();
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart();
      }
      expect(service.isListening()).toBe(true);

      // User stops before result
      service.enableVoice();
      expect(mockSpeechRecognition.stop).toHaveBeenCalled();

      // Simulate end
      if (mockSpeechRecognition.onend) {
        mockSpeechRecognition.onend();
      }
      expect(service.isListening()).toBe(false);
    });
  });
});


