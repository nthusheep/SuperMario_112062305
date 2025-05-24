// EnemySpawner.ts
import {
  _decorator,
  Component,
  TiledMap,
  Node,
  instantiate,
  Prefab,
  Vec3,
  RigidBody2D,
  ERigidBody2DType,
  BoxCollider2D,
} from 'cc';
import { EnemyController } from './EnemyController';
const { ccclass, property } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
  @property(TiledMap) public tileMap: TiledMap = null!;
  @property(Prefab)   public enemyPrefab: Prefab = null!;
  @property({ type: Node }) public gameManagerNode: Node = null!;

  start() {
    const group = this.tileMap.getObjectGroup('Enemies');
    if (!group) return;

    for (const obj of group.getObjects()) {
      // 1) 實例化 Prefab
      const en = instantiate(this.enemyPrefab);
      this.node.addChild(en);
      en.setWorldPosition(new Vec3(obj.x, obj.y, 0));

      // 2) 確保有剛體
      let rb = en.getComponent(RigidBody2D);
      if (!rb) rb = en.addComponent(RigidBody2D);
      rb.type = ERigidBody2DType.Kinematic;

      // 3) 確保有碰撞盒
      let bc = en.getComponent(BoxCollider2D);
      if (!bc) bc = en.addComponent(BoxCollider2D);
      // 如有需要可在這裡調整 bc.size / bc.offset

      // 4) 確保有你的 EnemyController
      let ec = en.getComponent(EnemyController);
      if (!ec) ec = en.addComponent(EnemyController);
      ec.gameManagerNode = this.gameManagerNode;
    }
  }
}
