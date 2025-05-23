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
  Vec2,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapColliderMerged')
export class MapColliderMerged extends Component {
  @property({ type: [CCString] })
  public layersToInit: string[] = ['Floor', 'Platform', 'Background'];

  start() {
    // 1. 打開物理系統與 Debug Draw
    PhysicsSystem2D.instance.enable = true;
    PhysicsSystem2D.instance.debugDrawFlags = 0;

    // 2. 取得 TileMap 組件
    const tm = this.getComponent(TiledMap)!;
    if (!tm) {
      console.error('找不到 TiledMap！請掛在含 TiledMap 的 Node 上');
      return;
    }
    const tileSize = tm.getTileSize();
    const mapNode = this.node;

    // 3. 針對每一層做掃描、合併 Collider
    for (const layerName of this.layersToInit) {
      const layer = tm.getLayer(layerName) as TiledLayer;
      if (!layer) {
        console.warn(`跳過：圖層 "${layerName}" 不存在`);
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

            // 拿到連續區段兩端 tile 的世界座標
            const tileA = layer.getTiledTileAt(runStart, y, true)!;
            const tileB = layer.getTiledTileAt(runEnd, y, true)!;
            const posA = tileA.node.getWorldPosition();
            const posB = tileB.node.getWorldPosition();

            // 中心點 worldMid（含半 tile 偏移）
            const worldMid = new Vec3(
              (posA.x + posB.x) / 2 + tileSize.width * 0.5,
              (posA.y + posB.y) / 2 + tileSize.height * 0.5,
              0,
            );

            // 建立新的空 Node，放到地圖根節點底下
            const colNode = new Node(`col_${layerName}_${y}_${runStart}`);
            mapNode.addChild(colNode);
            colNode.setWorldPosition(worldMid);

            // 計算這整段的寬高
            const runLen = runEnd - runStart + 1;
            const w = runLen * tileSize.width;
            const h = tileSize.height;

            // 加 BoxCollider2D，size 直接 set，offset 0,0 代表 node 世界座標為中心
            const collider = colNode.addComponent(BoxCollider2D);
            collider.size.set(w, h);
            collider.offset = new Vec2(0, 0);

            // 加靜態剛體
            const rb = colNode.addComponent(RigidBody2D);
            rb.type = ERigidBody2DType.Static;

            runStart = -1;
          }
        }
      }
    }
  }
}
