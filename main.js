
import { Mary } from './mary.js';
import { Input } from './input.js';
import {World} from './world.js'

/**@type {number} */
export const TILE_SIZE = 32;
/**@type {number} */
export const COLS = 20;
/**@type {number} */
export const ROWS = 15;


/**@type {number} */
const GAME_WIDTH =  TILE_SIZE * COLS;
/**@type {number} */
const GAME_HEIGHT = TILE_SIZE * ROWS;

export const HALF_TILE = TILE_SIZE / 2;
// export 

window.addEventListener('load',function(){
    /**@type {HTMLCanvasElement} */
    const canvas = this.document.getElementById('canvas1');
    /**@type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    class Game {
        constructor(){
            /**@type {World} */
            this.world = new World();
            /**@type {Hero} */
            this.mary = new Mary({
                game:this,
                sprite:{
                    image:document.getElementById("mary"),
                    x:0,
                    y:0,
                    width:64,
                    height:64
                },
                position:{x:3*TILE_SIZE,y:5*TILE_SIZE}
            });
            /**@type {Input} */
            this.input = new Input(this);
            this.eventUpdate = false;
            this.eventTimer = 0;
            this.eventInterval = 60;

            this.debug = false;
        }
        toggleDebug(){
            this.debug = !this.debug;
        }

        render(ctx,deltaTime){
            this.world.drawBackground(ctx);
            this.world.drawGrid(ctx);
            this.world.drawcollisonMap(ctx)
            this.mary.update(deltaTime);
            this.mary.draw(ctx);
            // this.world.drawForeground(ctx);
            if(this.eventTimer < this.eventInterval){
                this.eventTimer += deltaTime;
                this.eventUpdate = false;
            }else{
                this.eventTimer = 0;
                this.eventUpdate = true;
            }
        }
    }

    const game = new Game();

    let lastTime = 0;

    function animate(timeStamp){
        requestAnimationFrame(animate);
        // ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // console.log(deltaTime);
        game.render(ctx,deltaTime);
    }

    this.requestAnimationFrame(animate);

})