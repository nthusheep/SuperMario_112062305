import { _decorator, Component, Node, tween, UIOpacity, Button, director, Label, AudioSource, AudioClip } from 'cc';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends Component {
  @property(Button)
  public RestartButton!: Button;

  @property(Button)
  public menuButton!: Button;

  @property(Label)
  public timeLabel!: Label;

  @property(Label)
  public scoreLabel!: Label;

  @property(AudioSource)
  public audioSource!: AudioSource;

  @property(AudioClip)
  public winClip!: AudioClip;

  @property(Node)
  public winImageNode!: Node;

  @property({ tooltip: '淡入持續時間(秒)' })
  public fadeDuration = 2;

  start() {
    // 1. 播 Win 音效
    if (this.winClip) {
      this.audioSource.playOneShot(this.winClip, 1);
    }

    // 2. 淡入勝利圖片
    const uiOp = this.winImageNode.getComponent(UIOpacity) || this.winImageNode.addComponent(UIOpacity);
    uiOp.opacity = 0;
    tween(uiOp)
      .to(this.fadeDuration, { opacity: 255 })
      .start();

    // 3. 按鈕行為 & 顯示時間、分數
    // 重新開始本關
    this.RestartButton.node.on(Button.EventType.CLICK, () => {
      director.loadScene(`GameScene-L${GameData.currentLevel}`);
    });
    this.menuButton.node.on(Button.EventType.CLICK, () => director.loadScene('StartScene'));

    this.timeLabel.string  = `Time Used: ${GameData.timeUsed}s`;
    this.scoreLabel.string = `Score: ${GameData.finalScore}`;
  }
}
