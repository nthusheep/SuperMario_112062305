// assets/scripts/ui/TimeUI.ts
import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimeUI')
export class TimeUI extends Component {
  @property(Label) public timeLabel!: Label;

  /** 更新時間顯示 */
  public updateTime(sec: number) {
    this.timeLabel.string = `Time: ${sec}s`;
  }
}
