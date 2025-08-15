import { ROWS,COLS,TILE_SIZE } from "./main.js"
export class World{
    constructor(){
        this.level1 = {
            waterLayer:[],
            groundLayer:[],
            collisionLayer:[
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
                0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,
                0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
                0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,
                0,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,1,0,
                0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,0,
                0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,
                0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,
                0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,
                0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,
                0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            ],
            backgroundLayer:document.getElementById('bg'),

        }
    }
    getTile(array,row,col){
        return array[COLS * row + col];
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawBackground(ctx){
        ctx.drawImage(this.level1.backgroundLayer,0,0);
    }

    drawcollisonMap(ctx){
        ctx.fillStyle = 'rgba(0,0,255,0.5)';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if(this.getTile(this.level1.collisionLayer,row,col) === 1){

                    ctx.fillRect(
                        col * TILE_SIZE,
                        row * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE
                    )
                }
            }
        }
    }

    drawGrid(ctx){
        ctx.strokeStyle = 'black'
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                ctx.strokeRect(
                    col * TILE_SIZE,
                    row * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                )
            }
        }
    }
}