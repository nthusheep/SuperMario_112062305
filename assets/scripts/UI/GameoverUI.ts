// GameOverUI.ts
import { _decorator, Component, Node, tween, UIOpacity, Button, director, Label, AudioSource, AudioClip } from 'cc';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
  @property(Button)      restartButton!: Button;
  @property(Button)      MenuButton!: Button;
  @property(Label)       timeLabel!: Label;
  @property(Label)       scoreLabel!: Label;
  @property(AudioSource) audioSource!: AudioSource;
  @property(AudioClip)   gameOverClip!: AudioClip;

  // 新增：慢慢出現的圖片節點
  @property(Node)        slowImageNode!: Node;
  @property({ tooltip: '淡入持續時間(秒)' })
  fadeDuration = 2;

  start() {
    // 1. 播 GameOver 音效
    if (this.gameOverClip) {
      this.audioSource.playOneShot(this.gameOverClip, 1);
    }

    // 2. 淡入圖片
    const uiOp = this.slowImageNode.getComponent(UIOpacity) || this.slowImageNode.addComponent(UIOpacity);
    uiOp.opacity = 0;
    tween(uiOp)
      .to(this.fadeDuration, { opacity: 255 })
      .start();

    // 3. 按鈕 & 分數時間
        // 重試本關
    this.restartButton.node.on(Button.EventType.CLICK, () => {
      director.loadScene(`GameScene-L${GameData.currentLevel}`);
    });
    this.MenuButton.node.on(Button.EventType.CLICK,    () => director.loadScene('StartScene'));
    this.timeLabel.string  = `Time Used: ${GameData.timeUsed}s`;
    this.scoreLabel.string = `Score: ${GameData.finalScore}`;
  }
}
