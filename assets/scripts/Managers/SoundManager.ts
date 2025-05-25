import { _decorator, Component, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
  static instance: SoundManager;

  @property(AudioSource)
  public audioSource!: AudioSource;

  // 各種音效，直接在 Inspector 拉入對應的 AudioClip
  @property(AudioClip)
  public bgmClip!: AudioClip;

  @property(AudioClip)
  public jumpClip!: AudioClip;

  @property(AudioClip)
  public dieClip!: AudioClip;

  @property(AudioClip)
  public growClip!: AudioClip;

  @property(AudioClip)
  public blockClip!: AudioClip;

  @property(AudioClip)
  public enemyDieClip!: AudioClip;
  
  @property(AudioClip)
  public playerattacked!: AudioClip;
  
  onLoad() {
    SoundManager.instance = this;
    // 場景載入立即播放 BGM
    this.audioSource.clip = this.bgmClip;
    this.audioSource.loop = true;
    this.audioSource.play();
  }

  /** 播跳躍音效 */
  public playJump() {
    this.audioSource.playOneShot(this.jumpClip, 1);
  }

  /** 播死亡音效 */
  public playDie() {
    this.audioSource.playOneShot(this.dieClip, 1);
  }

  /** 播變大音效 */
  public playGrow() {
    this.audioSource.playOneShot(this.growClip, 1);
  }

  /** 播問號方塊敲擊音效 */
  public playBlockHit() {
    this.audioSource.playOneShot(this.blockClip, 1);
  }
  // 敵人死掉的音效
  public playEnemyDie() {
    this.audioSource.playOneShot(this.enemyDieClip, 1);
  }
  // 玩家被攻擊的音效
  public playPlayerAttacked() {
    this.audioSource.playOneShot(this.playerattacked, 1);
  }
}