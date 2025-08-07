import Tts from "react-native-tts";

class TTSService {
  private static instance: TTSService;
  private isInitialized = false;

  // Default voices
  static japaneseFemaleVoice = "ja-JP-language";
  static japaneseMaleVoice = "ja-jp-x-jad-network";

  private constructor() {
    // Prevent external instantiation
  }

  static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      // Base config
      Tts.setDefaultRate(0.5);
      Tts.setDefaultPitch(1.0);
      await Tts.setDefaultLanguage("ja-JP");
      await Tts.setDefaultVoice(TTSService.japaneseFemaleVoice);

      this.isInitialized = true;
    } catch (e) {
      console.warn("❗ Failed to initialize TTS:", e);
      await Tts.setDefaultLanguage("en-US");
    }
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const onDone = () => {
        Tts.removeEventListener("tts-finish", onDone);
        resolve();
      };

      Tts.addEventListener("tts-finish", onDone);
      Tts.speak(text);
    });
  }

  stop() {
    Tts.stop();
  }

  setVoice(voiceId: string) {
    Tts.setDefaultVoice(voiceId);
  }

  async speakWithVoice(text: string, voiceId: string): Promise<void> {
    await Tts.setDefaultVoice(voiceId);
    return this.speak(text);
  }
}

export default TTSService.getInstance();
