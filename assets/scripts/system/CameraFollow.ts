// CameraFollow.ts
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
  @property({ type: Node }) public target: Node | null = null;
  @property public offset = new Vec3(0, 0, 0);

  update() {
    if (this.target) {
      const p = this.target.worldPosition.clone();
      p.add(this.offset);
      this.node.worldPosition = p;
    }
  }
}
