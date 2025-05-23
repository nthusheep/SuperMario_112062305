// assets/scripts/ui/LifeUI.ts
import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LifeUI')
export class LifeUI extends Component {
  @property(Prefab)      public heartPrefab!: Prefab;
  @property(Node)        public uiContainer!: Node;
  @property public maxHearts: number = 3;

  private hearts: Node[] = [];

  start() {
    // 預先生成滿格
    for (let i = 0; i < this.maxHearts; i++) {
      const h = instantiate(this.heartPrefab);
      h.setParent(this.uiContainer);
      this.hearts.push(h);
    }
  }

  /** 更新要顯示的心數 */
  public updateHearts(count: number) {
    this.hearts.forEach((h, i) => h.active = i < count);
  }
}
