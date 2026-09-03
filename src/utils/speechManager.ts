// Web Speech API Voice Manager for JARVIS

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private voice: SpeechSynthesisVoice | null = null;
  private onVoicesChangedCallbacks: Array<(voices: SpeechSynthesisVoice[]) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoice();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            this.loadVoice();
            this.onVoicesChangedCallbacks.forEach(cb => cb(this.getAvailableVoices()));
          };
        }
      }
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public onVoicesAvailable(callback: (voices: SpeechSynthesisVoice[]) => void) {
    this.onVoicesChangedCallbacks.push(callback);
    const current = this.getAvailableVoices();
    if (current.length > 0) callback(current);
  }

  public getCurrentVoice(): SpeechSynthesisVoice | null {
    return this.voice;
  }

  public setVoiceByName(voiceName: string) {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    const found = voices.find(v => v.name === voiceName);
    if (found) {
      this.voice = found;
    }
  }

  private loadVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioritize natural sounding British or English voices that sound like a real person / Paul Bettany JARVIS
    const preferredNames = [
      'Google UK English Male',
      'Daniel',
      'Arthur',
      'George',
      'Oliver',
      'en-GB-Neural2-B',
      'en-GB-Wavenet-B',
      'Microsoft George',
      'Microsoft Ryan Online (Natural)',
      'en-US-Neural2-J',
      'Google US English',
    ];

    for (const name of preferredNames) {
      const match = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (match) {
        this.voice = match;
        return;
      }
    }

    const ukVoice = voices.find(v => v.lang === 'en-GB' || v.lang.includes('en-GB') || v.name.toLowerCase().includes('british'));
    const anyEn = voices.find(v => v.lang.startsWith('en'));
    this.voice = ukVoice || anyEn || voices[0] || null;
  }

  public speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!this.synth) {
      if (onStart) onStart();
      if (onEnd) setTimeout(onEnd, 1500);
      return;
    }

    this.synth.cancel();

    // Clean any markdown formatting, asterisks or code symbols from text for clean human speech
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    // Natural human speech rate and pitch
    utterance.rate = 1.0;
    utterance.pitch = 0.98;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn("Could not speak:", err);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  public isVoiceSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public startListening(
    onTranscript: (text: string) => void,
    onStatusChange?: (listening: boolean) => void
  ) {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      if (onStatusChange) onStatusChange(false);
      return;
    }

    if (this.isListening && this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (onStatusChange) onStatusChange(true);
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        this.isListening = false;
        if (onStatusChange) onStatusChange(false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onStatusChange) onStatusChange(false);
      };

      this.recognition.start();
    } catch (err) {
      console.warn("Failed to start speech recognition", err);
      this.isListening = false;
      if (onStatusChange) onStatusChange(false);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }
}

export const speechManager = new SpeechManager();
