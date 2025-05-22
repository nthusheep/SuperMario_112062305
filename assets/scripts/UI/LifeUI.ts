// scripts/UI/LifeUI.ts

import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LifeUI')
export class HeartUI extends Component {
  @property({ type: Prefab })
  heartPrefab: Prefab = null!;

  @property
  maxHearts: number = 3;

  private heartNodes: Node[] = [];

  start() {
    this.initHearts();
  }

  private initHearts() {
    // 清空
    this.heartNodes.forEach(h => h.destroy());
    this.heartNodes = [];

    // 每次從 prefab 建立
    for (let i = 0; i < this.maxHearts; i++) {
      const heart = instantiate(this.heartPrefab);
      heart.setParent(this.node);

      // 排列位置
      heart.setPosition(i * 30, 0); // 30 是水平間距
      this.heartNodes.push(heart);
    }
  }

  public updateHearts(count: number) {
    for (let i = 0; i < this.heartNodes.length; i++) {
      this.heartNodes[i].active = i < count;
    }
  }
}
