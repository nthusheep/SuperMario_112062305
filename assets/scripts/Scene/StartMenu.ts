import { _decorator, Component, Button, director, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends Component {
    @property(Button)
    startButton: Button = null!;

    @property(AudioSource)
    bgm: AudioSource = null!;

    start() {
        // 如果尚未播放，就播放（並且會 loop）
        if (this.bgm && !this.bgm.playing) {
            this.bgm.play();
        }

        this.startButton.node.on(Button.EventType.CLICK, this.onStartGame, this);
    }

    onStartGame() {
        director.loadScene('GameScene');
    }
}
