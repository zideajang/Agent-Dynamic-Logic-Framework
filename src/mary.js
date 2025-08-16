import { GameObject } from "./gameObject.js";
export class Mary extends GameObject{
    constructor({game, sprite, position,scale}){
        super({game, sprite, position,scale});
        this.speed = 300;
        this.maxFrame = 8;
        this.moving = false;

         this.arrived = true;
    }

    // New method to set the destination
    setDestination(x, y) {
        this.destinationPosition.x = x;
        this.destinationPosition.y = y;
        this.arrived = false; // Mary is no longer at her destination
        
        // You'll need to figure out the direction to update the sprite
        // For example, if nextX > this.position.x, set the sprite direction to RIGHT
        if (x > this.position.x) {
            this.sprite.y = 11; // Assuming 11 is the row for facing right
        } else if (x < this.position.x) {
            this.sprite.y = 9; // Assuming 9 is the row for facing left
        } else if (y > this.position.y) {
            this.sprite.y = 10; // Assuming 10 is the row for facing down
        } else if (y < this.position.y) {
            this.sprite.y = 8; // Assuming 8 is the row for facing up
        }
    }

    update(deltaTime){
        const scaledSpeed = this.speed * (deltaTime / 1000);
        
        const distance = this.moveTowards(this.destinationPosition,scaledSpeed);
        
        this.arrived = distance <= scaledSpeed;

        // If arrived, set destinationPosition to be the same as position
        if (this.arrived) {
            this.destinationPosition.x = this.position.x;
            this.destinationPosition.y = this.position.y;
        }

        // The moving state is now tied to whether she has arrived at her destination
        this.moving = !this.arrived;

        // Animation logic remains the same
        if(this.game.eventUpdate && this.moving){
            this.sprite.x < this.maxFrame?this.sprite.x++:this.sprite.x =0;
        } else if(!this.moving){
            this.sprite.x = 0;
        }
    }

    // update(deltaTime){
    //     let nextX = this.destinationPosition.x;
    //     let nextY = this.destinationPosition.y;

    //     const scaledSpeed = this.speed * (deltaTime / 1000);
    //     // console.log(scaledSpeed)

    //     const distance = this.moveTowards(this.destinationPosition,scaledSpeed);

    //     const arrived = distance <= scaledSpeed;

    //     if(arrived){

    //         if(this.game.input.lastKey === UP ){
    //             nextY -= TILE_SIZE;
    //             this.sprite.y = 8;
    //         }else if(this.game.input.lastKey === DOWN){
    //             nextY += TILE_SIZE;
    //             this.sprite.y = 10;
    //         }else if(this.game.input.lastKey === LEFT){
    //             nextX -= TILE_SIZE;
    //             this.sprite.y = 9;
    //         }else if(this.game.input.lastKey === RIGHT){
    //             nextX += TILE_SIZE;
    //             this.sprite.y = 11;
    //         }

    //         const col = nextX / TILE_SIZE;
    //         const row = nextY / TILE_SIZE;
    //         if(this.game.world.getTile(this.game.world.level1.collisionLayer,row,col) == 1){
    //             this.destinationPosition.x = nextX;
    //             this.destinationPosition.y = nextY;
    //         }


    //     }

    //     if(this.game.input.keys.length > 0 || !arrived ){
    //         this.moving = true;
    //     }else{
    //         this.moving = false;
    //     }

    //     if(this.game.eventUpdate && this.moving){
    //         this.sprite.x < this.maxFrame?this.sprite.x++:this.sprite.x =0;
            
    //     }else if(!this.moving){
    //         this.sprite.x = 0;
    //     }

    // }
}