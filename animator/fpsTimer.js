class FpsTimer{

    constructor(){
        this.frameRate = 12;
        this.lastFrameChange = 0;
        this.frameDuration = 0;
        this.calculateFrameDuration();
        this.changeFlag = false;
        this.playing = false;
    }

    calculateFrameDuration(){
        this.frameDuration = 1000 / this.frameRate;
    }

    play(){
        this.lastFrameChange = millis();
        this.playing = true;
    }

    update(){
        if(this.playing){
            let currentTime = millis();

            if(currentTime - this.lastFrameChange > this.frameDuration){
                this.changeFlag = true;
                this.lastFrameChange = millis();
            }
        }
    }

    setFrameRate(fps){
        this.frameRate = fps;
        this.calculateFrameDuration();
    }

    lowerFlag(){
        this.changeFlag = false;
    }

    checkChange(){
        return this.changeFlag;
    }

    isPlaying(){
        return this.playing;
    }






}