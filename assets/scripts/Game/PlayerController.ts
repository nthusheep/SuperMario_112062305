import {
  _decorator, Component,
  Input, input, EventKeyboard, KeyCode,
  RigidBody2D, Vec2,
  Collider2D, Contact2DType,
  Animation, Sprite, Vec3, tween,
  BoxCollider2D, director,
  Node,
} from 'cc';
import { SoundManager } from '../Managers/SoundManager'; // 統一管理
import { GameManager } from '../Managers/GameManager'; // 引入 GameManager
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  private body!: RigidBody2D;
  private anim!: Animation;
  private sprite!: Sprite;
  private moveDir = 0;
  private isGrounded = false;
  private gameManager: GameManager | null = null; // 用於儲存 GameManager 實例
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

    // 可選：訂閱成長事件（若採用事件驅動）
    // this.node.on('player-grow', this.grow, this);
  }

  update(dt: number) {
    this.body.linearVelocity = new Vec2(
      this.moveDir * this.moveSpeed,
      this.body.linearVelocity.y
    );

    if (this.moveDir < 0) {
      this.node.setScale(new Vec3(-Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z));
    } else if (this.moveDir > 0) {
      this.node.setScale(new Vec3(Math.abs(this.node.scale.x), this.node.scale.y, this.node.scale.z));
    }

    if (this.moveDir === 0 && this.isGrounded) {
      this.anim.stop();
    }

    if (this.node.worldPosition.y < -100) {
      SoundManager.instance.playDie(); // 播死亡音效
      this.respawn();
    }
    // --- 勝利條件判斷 ---
    // 假設 X 軸 1560 且 Y 軸大於等於 0 為勝利條件
    if (this.node.worldPosition.y >= 0 && this.node.worldPosition.x >= 1560) {
      GameManager.instance?.onGameWin();  // ← 直接呼叫
      this.enabled = false;
    }
  }

  private onKeyDown(evt: EventKeyboard) {
    switch (evt.keyCode) {
      case KeyCode.KEY_A:
        this.moveDir = -1;
        break;
      case KeyCode.KEY_D:
        this.moveDir = 1;
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
      SoundManager.instance.playJump(); // 跳躍音效
    }
  }

  private onBeginContact(
    self: Collider2D, other: Collider2D, contact: any
  ) {
    this.isGrounded = true;

    // 如果當前動畫是跳躍，就不做任何切換
    const jumpState = this.anim.getState('Mario_Jump');
    const isJumping = jumpState?.isPlaying;

    // 落地時且正在移動，但不能是還在播跳躍動畫時，就播走路
    if (this.moveDir !== 0 && !isJumping) {
      const walkState = this.anim.getState('Mario_Walk');
      if (!walkState || !walkState.isPlaying) {
        this.anim.play('Mario_Walk');
      }
    }
  }

  private onEndContact(
    self: Collider2D, other: Collider2D, contact: any
  ) {
    this.isGrounded = false;
  }

  private respawn() {
    this.body.linearVelocity = new Vec2(0, 0);
    this.node.setWorldPosition(new Vec3(100, 400, 0));
    this.node.scene.emit('player-died');
  }

  /**
   * 吃到蘑菇後變大
   */
  public grow(duration = 9.3) {
    // 播放變大音效
    SoundManager.instance.playGrow();
    // 1. 放大角色
    tween(this.node)
      .to(0.1, { scale: new Vec3(1.5, 1.5, 1) })
      .start();

    // 2. 同步放大碰撞體，防止穿透
    const box = this.getComponent(BoxCollider2D);
    if (box) {
      const sz = box.size.clone();
      sz.width *= 1.2;
      sz.height *= 1.2;
      box.size = sz;
    }
    // 移動速度跳躍高度增加
    this.moveSpeed *= 1.2;
    this.jumpForce *= 1.2;
    // 固定持續時間後回復
    this.scheduleOnce(() => this.shrink(), duration);
  }
  /**
   * 縮小角色
   */
  public shrink() {
    // 1. 縮小角色
    tween(this.node)
      .to(0.1, { scale: new Vec3(1, 1, 1) })
      .start();

    // 2. 同步縮小碰撞體
    const box = this.getComponent(BoxCollider2D);
    if (box) {
      const sz = box.size.clone();
      sz.width /= 1.2;
      sz.height /= 1.2;
      box.size = sz;
    }
    // 恢復原來速度和跳躍高度
    this.moveSpeed /= 1.2;
    this.jumpForce /= 1.2;
  }

}
