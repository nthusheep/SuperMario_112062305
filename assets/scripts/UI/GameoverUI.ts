import { _decorator, Component, Button, director, Label } from 'cc';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
  @property(Button) restartButton!: Button;
  @property(Button) MenuButton!: Button;

  @property(Label) timeLabel!: Label;
  @property(Label) scoreLabel!: Label;

  start() {
    this.restartButton.node.on(Button.EventType.CLICK, () => {
      director.loadScene('GameScene');
    });

    this.MenuButton.node.on(Button.EventType.CLICK, () => {
      director.loadScene('StartScene');
    });

    // ✅ 顯示分數與時間
    this.timeLabel.string = `Time Used: ${GameData.timeUsed}s`;
    this.scoreLabel.string = `Score: ${GameData.finalScore}`;
  }
}
