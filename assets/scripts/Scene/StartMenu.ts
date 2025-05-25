import { _decorator, Component, Button, director, AudioSource, Camera, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartMenu')
export class StartMenu extends Component {
    @property(Button)
    startButton: Button = null!;

    @property(AudioSource)
    bgm: AudioSource = null!;

    
    onLoad () {
      const cam = this.getComponent(Camera)!;
      // 這裡假設你想讓世界坐標的高度 = 畫布像素高度 / 某個倍率
      cam.orthoHeight = view.getVisibleSize().height / 2;
    }

    start() {
        
        this.bgm.play()
        this.startButton.node.on(Button.EventType.CLICK, this.onStartGame, this);
    }

    onStartGame() {
        director.loadScene('LevelSelectScene');
    }
}
