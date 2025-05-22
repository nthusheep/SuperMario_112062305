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
  UITransform
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MapColliderMerged')
export class MapColliderMerged extends Component {
  @property({ type: [CCString] })
  public layersToInit: string[] = ['Floor', 'Platform'];

  start() {
    // 開啟物理系統
    PhysicsSystem2D.instance.enable = true;
    PhysicsSystem2D.instance.debugDrawFlags = 0;

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

            const tileA = layer.getTiledTileAt(runStart, y, true)!;
            const tileB = layer.getTiledTileAt(runEnd, y, true)!;
            const posA = tileA.node.getWorldPosition();
            const posB = tileB.node.getWorldPosition();
            const worldMid = new Vec3(
              (posA.x + posB.x) / 2,
              (posA.y + posB.y) / 2,
              0
            );

            const colNode = new Node(`col_${layerName}_${y}_${runStart}`);
            colNode.parent = mapNode;

            const localMid = ui.convertToNodeSpaceAR(worldMid);
            colNode.setPosition(localMid.x, localMid.y, 0);

            const runLen = runEnd - runStart + 1;
            const w = runLen * tileSize.width;
            const h = tileSize.height;

            const c = colNode.addComponent(BoxCollider2D);
            c.size.set(w, h);
            c.offset.set(tileSize.width / 2, tileSize.height / 2);

            const rb = colNode.addComponent(RigidBody2D);
            rb.type = ERigidBody2DType.Static;
            runStart = -1;
          }
        }
      }
    }
  }
}
