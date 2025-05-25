import {
  _decorator,
  Component,
  Node,
  TiledMap,
  TiledLayer,
  UITransform,
  Vec2,
  Vec3,
  RigidBody2D,
  Collider2D,
  Contact2DType,
  BoxCollider2D,
  Animation,
  Sprite,
  SpriteFrame,
} from 'cc';
import { GameManager } from '../Managers/GameManager';
import { SoundManager } from '../Managers/SoundManager'; // 統一管理音效
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
  /** 拖入含 TiledMap 的节点 */
  @property({ type: Node }) public mapNode: Node = null!;

  /** 拖入挂有 GameManager 的 Managers 节点 */
  @property({ type: Node }) public gameManagerNode: Node = null!;

  /** 死亡时的动画帧 */
  @property({ type: SpriteFrame }) public deathFrame: SpriteFrame = null!;
  /** 巡逻速度 */
  @property public speed = 2;
  @property(Animation) public Walkanim!: Animation;
  private tiledMap!: TiledMap;
  private floorLayer!: TiledLayer;
  private tileSize = { width: 0, height: 0 };
  private mapSize = { width: 0, height: 0 };

  private rb!: RigidBody2D;
  private gm!: GameManager;
  private dir = 1;  // 1 向右, -1 向左
  // 解決卡牆角了!!!!!!!!!!!!!!!!!!
  private lastPos = new Vec3();
  private stuckTime = 0;
  start() {
    // 获取 TileMap 及 Floor 层
    this.tiledMap   = this.mapNode.getComponent(TiledMap)!;
    this.floorLayer = this.tiledMap.getLayer('Floor') as TiledLayer;
    const ts        = this.tiledMap.getTileSize();
    this.tileSize   = { width: ts.width, height: ts.height };
    this.mapSize    = this.tiledMap.getMapSize();

    // 获取刚体和 GameManager
    this.rb = this.getComponent(RigidBody2D)!;
    this.gm = this.gameManagerNode.getComponent(GameManager)!;

    // 注册与玩家的碰撞回调
    this.getComponent(BoxCollider2D)!.on(
      Contact2DType.BEGIN_CONTACT,
      this.onBeginContact,
      this
    );

    // 初始化朝向
    this.node.setScale(new Vec3(this.dir * Math.abs(this.node.scale.x), 1, 1));
    this.Walkanim.play();
    // 解決卡牆角
    this.lastPos = this.node.worldPosition.clone();
  }

  update(dt: number) {
  // 1. 水平推進
  this.rb.linearVelocity = new Vec2(this.speed * this.dir, this.rb.linearVelocity.y);

  // 2. world -> map-local -> tileX
  const wp    = this.node.worldPosition;
  const mapUT = this.mapNode.getComponent(UITransform)!;
  let loc     = mapUT.convertToNodeSpaceAR(new Vec3(wp.x, wp.y, 0));
  loc.x      += mapUT.width  * mapUT.anchorX;
  loc.y      += mapUT.height * mapUT.anchorY;

  const currX = Math.floor(loc.x / this.tileSize.width);
  const nextX = currX + this.dir;

  // 邊界翻轉
  if (nextX < 0 || nextX >= this.mapSize.width) {
    this.turn();
    // 重置卡牆偵測
    this.stuckTime = 0;
    this.lastPos = this.node.worldPosition.clone();
    return;
  }

  // 3. 掃地板高度
  let currH = -1, nextH = -1;
  for (let y = this.mapSize.height - 1; y >= 0; y--) {
    if (this.floorLayer.getTileGIDAt(currX, y) !== 0) { currH = y; break; }
  }
  for (let y = this.mapSize.height - 1; y >= 0; y--) {
    if (this.floorLayer.getTileGIDAt(nextX, y) !== 0) { nextH = y; break; }
  }

  // 4. 懸崖／高度差翻轉
  if (currH !== nextH) {
    this.turn();
    this.stuckTime = 0;
    this.lastPos = this.node.worldPosition.clone();
    return;
  }

  // 5. 卡住超過 1 秒就翻面
  const currPos = this.node.worldPosition.clone();
  if (currPos.equals(this.lastPos)) {
    this.stuckTime += dt;
    if (this.stuckTime >= 1) {
      this.turn();
      this.stuckTime = 0;
    }
  } else {
    this.stuckTime = 0;
  }
  this.lastPos = currPos;
}


  private onBeginContact(self: Collider2D, other: Collider2D) {
    if (other.node.name === 'Player') {
      const py = other.node.worldPosition.y;
      const my = this.node.worldPosition.y;
      if (py > my + 9) {
        // 玩家踩
        const playerRb = other.getComponent(RigidBody2D);
        this.gm.addScore(200);
        this.die();
        const bounceVel = new Vec2(0, 20);
        playerRb.linearVelocity = bounceVel;
      } else {
        // 玩家側撞或下撞怪，直接彈開
        const playerRb = other.getComponent(RigidBody2D);
        if (playerRb) {
          // 決定彈開方向：Player 在 Enemy 左邊就往左，反之往右
          const px        = other.node.worldPosition.x;
          const ex        = this.node.worldPosition.x;
          const bounceDir = px < ex ? -1 : 1;
          // 給一個水平+垂直速度
          const bounceVel = new Vec2(bounceDir * 16, 16);
          playerRb.linearVelocity = bounceVel;
        }
        // 玩家受伤
        SoundManager.instance.playPlayerAttacked(); // 播放死亡音效
        this.gm.loseLife();
      }
    }
  }

  private die() {    
    const sprite = this.getComponent(Sprite)!;
    sprite.spriteFrame = this.deathFrame;
    this.scheduleOnce(() => this.node.destroy(), 0.1);
    // 死亡音效
    SoundManager.instance.playEnemyDie();
    
  }

  private turn() {
    this.dir *= -1;
    this.node.setScale(new Vec3(
      this.dir * Math.abs(this.node.scale.x),
      this.node.scale.y,
      1
    ));
  }
}
