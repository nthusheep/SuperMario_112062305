import {
  _decorator,
  Component,
  Sprite,
  SpriteFrame,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
  Animation,
  AnimationClip,
  Vec3,
  tween,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('QuestionBlock')
export class QuestionBlock extends Component {
  @property(SpriteFrame)
  public usedFrame: SpriteFrame = null!;

  @property(AnimationClip)
  public idleAnim: AnimationClip = null!;

  private isUsed = false;

  start() {
    // 播 idle
    this.getComponent(Animation)!.play(this.idleAnim.name);

    // 監聽碰撞
    this.getComponent(Collider2D)!
        .on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  private onBeginContact(
    _self: Collider2D,
    _other: Collider2D,
    contact: IPhysics2DContact
  ) {
    if (this.isUsed) return;

    const n = contact.getWorldManifold().normal;      // 玩家頂上來時 n.y ≈ -1
    if (n.y < -0.7) {                                // ← 關鍵：改成 < -0.7
      this.isUsed = true;
      this.triggerBounce();
    }
  }

  private triggerBounce() {
    // 停動畫 + 換貼圖
    this.getComponent(Animation)!.stop();
    this.getComponent(Sprite)!.spriteFrame = this.usedFrame;

    // 彈 10px
    tween(this.node)
      .by(0.08, { position: new Vec3(0, 10, 0) })
      .by(0.08, { position: new Vec3(0, -10, 0) })
      .start();
  }
}
