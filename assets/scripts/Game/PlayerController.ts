import {
  _decorator, Component,
  Input, input, EventKeyboard, KeyCode,
  RigidBody2D, Vec2,
  Collider2D, Contact2DType,
  Animation, Sprite, Vec3
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  private body!: RigidBody2D;
  private anim!: Animation;
  private sprite!: Sprite;
  private moveDir = 0;
  private isGrounded = false;

  @property moveSpeed = 6;
  @property jumpForce = 20;

  start() {
    this.body   = this.getComponent(RigidBody2D)!;
    this.anim   = this.getComponent(Animation)!;
    this.sprite = this.getComponent(Sprite)!;

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP,   this.onKeyUp,   this);

    const col = this.getComponent(Collider2D)!;
    col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    col.on(Contact2DType.END_CONTACT,   this.onEndContact,   this);
  }

  update(dt: number) {
    // 水平移動
    this.body.linearVelocity = new Vec2(
      this.moveDir * this.moveSpeed,
      this.body.linearVelocity.y
    );

    // —— 新增：每幀都根據 moveDir 翻轉
    if (this.moveDir < 0) {
      this.node.setScale(new Vec3(-Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z));
    } else if (this.moveDir > 0) {
      this.node.setScale(new Vec3(Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z));
    }

    // 停止時停動畫
    if (this.moveDir === 0 && this.isGrounded) {
      this.anim.stop();
    }
  }

  private onKeyDown(evt: EventKeyboard) {
    switch (evt.keyCode) {
      case KeyCode.KEY_A:
        this.moveDir = -1;
        if (this.isGrounded) this.anim.play('Mario_Walk');
        break;
      case KeyCode.KEY_D:
        this.moveDir = 1;
        if (this.isGrounded) this.anim.play('Mario_Walk');
        break;
      case KeyCode.SPACE:
        this.jump();
        this.anim.play('Mario_Jump');
        break;
    }
  }

  private onKeyUp(evt: EventKeyboard) {
    if ((evt.keyCode === KeyCode.KEY_A && this.moveDir === -1) ||
        (evt.keyCode === KeyCode.KEY_D && this.moveDir === 1)) {
      this.moveDir = 0;
      this.body.linearVelocity = new Vec2(0, this.body.linearVelocity.y);
      this.anim.stop();
    }
  }

  private jump() {
    if (this.isGrounded) {
      this.body.linearVelocity = new Vec2(this.body.linearVelocity.x, this.jumpForce);
      this.isGrounded = false;
    }
  }

  private onBeginContact(
    self: Collider2D, other: Collider2D, contact: any
  ) {
    this.isGrounded = true;
  }

  private onEndContact(
    self: Collider2D, other: Collider2D, contact: any
  ) {
    this.isGrounded = false;
  }
}
