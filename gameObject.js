import { ROWS,COLS,TILE_SIZE,HALF_TILE } from "./main.js"
export class GameObject{
    constructor({
        game,
        sprite,
        position,
        scale
    })
    {
        this.game = game;
        this.sprite = sprite ?? {x:0,y:0,width:TILE_SIZE,height:TILE_SIZE,image:""};
        this.position = position??{x:0,y:0};
        this.scale = scale ?? 1;

    

        this.destinationPosition = {x:this.position.x,y:this.position.y};
        this.distanceToTravel = {x:0,y:0};

        this.width = this.sprite.width * this.scale;
        this.halfWidth = this.width/2;
        this.height = this.sprite.height * this.scale;
        this.halfHeight = this.height/2;

    }

     moveTowards(destinationPosition,speed){
        // 设定目标位置为 destinationPosition

        // 首先计算 (目标位置 - 当前位置) 符号表示方向
        this.distanceToTravel.x = destinationPosition.x - this.position.x;
        this.distanceToTravel.y = destinationPosition.y - this.position.y;

        // let distance = Math.sqrt(this.distanceToTravel.x**2 + this.distanceToTravel.y**2);
        // 计算（目标位置和当前位置的距离，也就是距离模
        let distance = Math.hypot(this.distanceToTravel.x,this.distanceToTravel.y);

        if(distance <= speed){
            // if close enough snap to positino
            // 如果距离
            this.position.x = this.destinationPosition.x;
            this.position.y = this.destinationPosition.y;
        }else{
            // stepX (a - b)/morn(a-b)
            const stepX = this.distanceToTravel.x / distance;
            const stepY = this.distanceToTravel.y / distance;
            // 将 speed 投影在 x，y 坐标轴
            this.position.x += stepX * speed;
            this.position.y += stepY * speed;

            //remaining distance
            this.distanceToTravel.x = destinationPosition.x - this.position.x;
            this.distanceToTravel.y = destinationPosition.y - this.position.y;

            distance = Math.hypot(this.distanceToTravel.x,this.distanceToTravel.y)
        }

        return distance
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx){
        ctx.fillStyle = 'blue';
        
        ctx.fillRect(
            this.position.x,
            this.position.y,
            TILE_SIZE,
            TILE_SIZE
        )
        ctx.strokeStyle = 'yellow';

        ctx.strokeRect(
            this.destinationPosition.x,
            this.destinationPosition.y,
            TILE_SIZE,
            TILE_SIZE
        )
        
        ctx.drawImage(
            this.sprite.image,
            this.sprite.x * this.sprite.width,
            this.sprite.y * this.sprite.height,
            this.sprite.width,
            this.sprite.height,
            this.position.x + HALF_TILE - this.halfWidth,
            this.position.y + TILE_SIZE - this.height,
            this.width,
            this.height

        );
    }
}