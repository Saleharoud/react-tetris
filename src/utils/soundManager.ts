type SoundEffect = 'move' | 'rotate' | 'hardDrop' | 'lineClear' | 'tetris' | 'levelUp' | 'gameOver' | 'hold';

class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<SoundEffect, HTMLAudioElement>;
  private bgMusic: HTMLAudioElement | null;
  private isMuted: boolean;
  private volume: number;

  private constructor() {
    this.sounds = new Map();
    this.bgMusic = null;
    this.isMuted = false;
    this.volume = 0.7;

    // Initialize sound effects
    this.initializeSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeSounds() {
    const soundEffects: SoundEffect[] = ['move', 'rotate', 'hardDrop', 'lineClear', 'tetris', 'levelUp', 'gameOver', 'hold'];
    
    soundEffects.forEach(effect => {
      const audio = new Audio(`/sounds/${effect}.mp3`);
      audio.volume = this.volume;
      this.sounds.set(effect, audio);
    });

    // Initialize background music
    this.bgMusic = new Audio('/sounds/bgMusic.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = this.volume * 0.5; // Background music slightly quieter
  }

  public playSound(effect: SoundEffect) {
    if (this.isMuted) return;
    
    const sound = this.sounds.get(effect);
    if (sound) {
      // Clone and play to allow overlapping sounds
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = this.volume;
      clone.play().catch(err => console.warn('Error playing sound:', err));
    }
  }

  public startMusic() {
    if (this.isMuted || !this.bgMusic) return;
    this.bgMusic.play().catch(err => console.warn('Error playing background music:', err));
  }

  public stopMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  public pauseMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
  }

  public resumeMusic() {
    if (!this.isMuted && this.bgMusic) {
      this.bgMusic.play().catch(err => console.warn('Error resuming background music:', err));
    }
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update all sound effects
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });

    // Update background music
    if (this.bgMusic) {
      this.bgMusic.volume = this.volume * 0.5;
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }
}

export const soundManager = SoundManager.getInstance(); 