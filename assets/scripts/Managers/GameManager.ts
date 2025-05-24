// assets/scripts/managers/GameManager.ts
import {
  _decorator, Component, Prefab, Node, Vec3, director, instantiate
} from 'cc';
import { LifeUI } from '../UI/LifeUI';
import { ScoreUI } from '../UI/ScoreUI';
import { TimeUI }  from '../UI/TimeUI';
import { GameData } from '../data/GameData'; 
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
  /** UI 組件 */
  @property(LifeUI)  public lifeUI!: LifeUI;
  @property(ScoreUI) public scoreUI!: ScoreUI;
  @property(TimeUI)  public timeUI!: TimeUI;

  /** 可在 Inspector 調整的參數 */
  @property public maxLives: number  = 3;
  @property public timeLimit: number = 60; // 秒

  /** 內部狀態 */
  private lives: number = 0;
  private score: number = 0;
  private elapsedTime: number = 0; // ✅ 改為計時器

  start() {
    // 初始化狀態
    this.lives = this.maxLives;
    this.score = 0;
    this.timeUI.updateTime(this.elapsedTime); // ✅ 顯示 0 秒
    // 一開始更新 UI
    this.lifeUI.updateHearts(this.lives);
    this.scoreUI.updateScore(this.score);
    this.timeUI.updateTime(this.elapsedTime);

    // 開始每秒倒數
    this.schedule(this._tick, 1); // 每秒觸發一次
    this.node.scene.on('player-died', this.loseLife, this);

    // 🔥 監聽玩家死亡事件
    this.node.scene.on('player-died', this.loseLife, this);
  }

  /** 每秒呼叫一次 */
  private _tick() {
    this.elapsedTime++; // ✅ 每秒加一秒
    this.timeUI.updateTime(this.elapsedTime);
  }

  /** 外部呼叫：加分 */
  public addScore(points: number) {
    this.score += points;
    this.scoreUI.updateScore(this.score);
  }

  /** 外部呼叫：玩家死亡 */
  public loseLife() {
    this.lives = Math.max(0, this.lives - 1);
    this.lifeUI.updateHearts(this.lives);
    if (this.lives <= 0) {
      this.onGameOver('No More Lives');
    } else {
      this.respawnPlayer();
    }
  }

  private respawnPlayer() {
    // 你可以透過 eventBus 或直接操作 Player 節點重置位置
    this.node.emit('player-respawn');
  }

  private onGameOver(reason: string) {
    console.log('Game Over:', reason);
    this.unschedule(this._tick);

    // ✅ 儲存時間與分數到 GameData
    GameData.timeUsed = this.elapsedTime;
    GameData.finalScore = this.score;

    director.loadScene('GameoverScene');
  }
}
