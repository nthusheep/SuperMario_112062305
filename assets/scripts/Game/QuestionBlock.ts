// scripts/game/QuestionBlock.ts
import {
  _decorator, Component,
  Collider2D, Contact2DType,
  IPhysics2DContact, Sprite, SpriteFrame
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('QuestionBlock')
export class QuestionBlock extends Component {
  @property(SpriteFrame) usedFrame: SpriteFrame = null!;

  private used = false;

  start() {
    const col = this.getComponent(Collider2D)!;
    col.on(Contact2DType.BEGIN_CONTACT, this.onHit, this);
  }

  private onHit(
    self: Collider2D,
    other: Collider2D,
    contact: IPhysics2DContact
  ) {
    const n = contact.getWorldManifold().normal;
    if (n.y < 0 && !this.used) {
      this.used = true;
      this.getComponent(Sprite)!.spriteFrame = this.usedFrame;
      self.enabled = false;
    }
  }
}
