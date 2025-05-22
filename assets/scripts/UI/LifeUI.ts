import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LifeUI')
export class LifeUI extends Component {
  @property({ type: Prefab })
  heartPrefab: Prefab = null!;

  @property({ type: Node })
  uiContainer: Node = null!;

  @property
  maxHearts: number = 3;

  private heartNodes: Node[] = [];

  start() {
    this.initHearts();
  }

  private initHearts() {
    this.heartNodes.forEach(h => h.destroy());
    this.heartNodes = [];
    for (let i = 0; i < this.maxHearts; i++) {
      const heart = instantiate(this.heartPrefab);
      heart.setParent(this.uiContainer);
      this.heartNodes.push(heart);
    }
  }

  public updateHearts(count: number) {
    this.heartNodes.forEach((h, i) => h.active = i < count);
  }
}
