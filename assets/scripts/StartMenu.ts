import { _decorator, Component, Button, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends Component {
    @property(Button)
    startButton: Button = null!;

    start() {
        this.startButton.node.on(Button.EventType.CLICK, this.onStartGame, this);
    }

    onStartGame() {
        director.loadScene('GameScene'); // 等等會做這個場景
    }
}
