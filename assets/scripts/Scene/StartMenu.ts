import { _decorator, Component, Button, director, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends Component {
    @property(Button)
    startButton: Button = null!;

    @property(AudioSource)
    bgm: AudioSource = null!;

    start() {
        // ✅ 一進場就播音樂（並 loop）
        if (this.bgm && !this.bgm.playing) {
            this.bgm.play();
        }

        // 設定按鈕行為
        this.startButton.node.on(Button.EventType.CLICK, this.onStartGame, this);
    }

    onStartGame() {
        director.loadScene('GameScene');
    }
}
