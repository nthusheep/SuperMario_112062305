// assets/scripts/ui/ScoreUI.ts
import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
  @property(Label) public scoreLabel!: Label;

  /** 更新分數顯示 */
  public updateScore(value: number) {
    this.scoreLabel.string = `Score: ${value}`;
  }
}
