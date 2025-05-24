// Mushroom.ts
import {
  _decorator, Component,
  Collider2D, Contact2DType, IPhysics2DContact
} from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass } = _decorator;

@ccclass('Mushroom')
export class Mushroom extends Component {
  start() {
    // 假設已經設好 Rigidbody2D 讓它往右走
    this.getComponent(Collider2D)!.on(Contact2DType.BEGIN_CONTACT, this.onHit, this);
  }

  private onHit(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
    const player = other.node.getComponent(PlayerController);
    if (player) {
      // 給玩家長大
      player.grow();
      // 把蘑菇消除
      this.node.destroy();
    }
  }
}
