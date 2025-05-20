// scripts/system/MapColliderMerged.ts

import {
  _decorator,
  Component,
  TiledMap,
  TiledLayer,
  BoxCollider2D,
  RigidBody2D,
  ERigidBody2DType,
  PhysicsSystem2D,
  CCString,
  Node,
  Vec3,
  UITransform,
  SpriteFrame,
} from 'cc';
import { QuestionBlock } from '../Game/QuestionBlock';
const { ccclass, property } = _decorator;

@ccclass('MapColliderMerged')
export class MapColliderMerged extends Component {
  @property({ type: [CCString] })
  public layersToInit: string[] = ['Floor', 'Platform', 'QuestionBlock'];

  @property(SpriteFrame)
  public usedFrame: SpriteFrame = null!;

  start() {
    // 開啟物理系統
    PhysicsSystem2D.instance.enable = true;
    PhysicsSystem2D.instance.debugDrawFlags = 1;

    const tm = this.getComponent(TiledMap)!;
    if (!tm) {
      console.error('找不到 TiledMap！');
      return;
    }

    const tileSize = tm.getTileSize();
    const mapNode = this.node;
    const ui = mapNode.getComponent(UITransform)!;

    for (const layerName of this.layersToInit) {
      const layer = tm.getLayer(layerName) as TiledLayer;
      if (!layer) {
        console.warn(`圖層 "${layerName}" 不存在，跳過`);
        continue;
      }
      const { width, height } = layer.getLayerSize();

      for (let y = 0; y < height; y++) {
        let runStart = -1;
        for (let x = 0; x <= width; x++) {
          const gid = x < width ? layer.getTileGIDAt(x, y) : 0;
          if (gid > 0) {
            if (runStart < 0) runStart = x;
          } else if (runStart >= 0) {
            const runEnd = x - 1;

            // 取得排頭與排尾的瓦片節點
            const tileA = layer.getTiledTileAt(runStart, y, true)!;
            const tileB = layer.getTiledTileAt(runEnd, y, true)!;
            const posA = tileA.node.getWorldPosition();
            const posB = tileB.node.getWorldPosition();
            const worldMid = new Vec3(
              (posA.x + posB.x) / 2,
              (posA.y + posB.y) / 2,
              0
            );

            // 建立碰撞節點
            const colNode = new Node(`col_${layerName}_${y}_${runStart}`);
            colNode.parent = mapNode;

            // 轉成本地座標
            const localMid = ui.convertToNodeSpaceAR(worldMid);
            colNode.setPosition(localMid.x, localMid.y, 0);

            // 計算大小
            const runLen = runEnd - runStart + 1;
            const w = runLen * tileSize.width;
            const h = tileSize.height;

            // 加 BoxCollider2D
            const c = colNode.addComponent(BoxCollider2D);
            c.size.set(w, h);
            c.offset.set(tileSize.width / 2, tileSize.height / 2);

            // 加 Static RigidBody2D
            const rb = colNode.addComponent(RigidBody2D);
            rb.type = ERigidBody2DType.Static;

            // 如果這是問號磚層，掛問號磚互動腳本並設定灰階貼圖
            if (layerName === 'QuestionBlock') {
              // 新增問號磚互動腳本，並轉成 QuestionBlock 類型
            const qb = colNode.addComponent(QuestionBlock) as QuestionBlock;
              qb.usedFrame = this.usedFrame;
            }

            runStart = -1;
          }
        }
      }
    }
  }
}
