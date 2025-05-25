import { _decorator, Component, Button, director } from 'cc';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass('LevelSelectUI')
export class LevelSelectUI extends Component {
  @property(Button)
  public level1Button!: Button;

  @property(Button)
  public level2Button!: Button;

  @property(Button)
  public backButton!: Button; // 可選：返回主選單

  start() {
    // 第一關按鈕綁定
    this.level1Button.node.on(Button.EventType.CLICK, () => {
      GameData.currentLevel = 1;
      director.loadScene('GameScene-L1');
    });

    // 第二關按鈕綁定
    this.level2Button.node.on(Button.EventType.CLICK, () => {
      GameData.currentLevel = 2;
      director.loadScene('GameScene-L2');
    });

    // 返回選單（如果有 StartScene）
    this.backButton.node.on(Button.EventType.CLICK, () => {
      director.loadScene('StartScene');
    });
  }
}
