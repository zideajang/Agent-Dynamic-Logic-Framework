
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

            //浏览器端发起ollama请求获取 [{x,y},{x1,y1}....]
            // this.fetchPathFromOllama();
            this.fetchPathFromOllama();
            

            this.maryPath = [
                { x: 3 * TILE_SIZE, y: 5 * TILE_SIZE },
                { x: 5 * TILE_SIZE, y: 5 * TILE_SIZE },
                { x: 5 * TILE_SIZE, y: 8 * TILE_SIZE },
                { x: 8 * TILE_SIZE, y: 8 * TILE_SIZE },
                { x: 8 * TILE_SIZE, y: 5 * TILE_SIZE },
                { x: 10 * TILE_SIZE, y: 5 * TILE_SIZE },
            ];

            this.currentWaypointIndex = 0;
            this.lastWaypointTime = 0;
            this.waypointInterval = 1000;

            this.debug = false;
        }

        async fetchPathFromOllama(){
            console.log("Requesting path from Ollama...");
            const prompt = "Generate a path for a character in a 20x15 grid. The path should be an array of coordinate objects [{x: int, y: int}, ...]. The coordinates should use a tile size of 32 pixels. The path should start at {x: 5, y: 1} and follow a short, interesting route. Only return the JSON array, nothing else.";

            try {
                const response = await fetch("http://localhost:11434/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "qwen3:8b", // or another installed model
                        messages: [
                            {role:"system",content:`x 取值范围 0 - 20 (Col) y 取值范围 0 到 15 (ROW)
以下位置是可以移动文字
Row 4: (4,1) to (4,13), and (4,18)
Row 5: (5,1) to (5,18)
Row 6: (6,1) to (6,13), and (6,18)
Row 7: (7,1) to (7,10), (7,13), and (7,18)
Row 8: (8,1) to (8,9), (8,11) to (8,13), (8,15) to (8,18)
Row 9: (9,1) to (9,11), (9,15) to (9,18)
Row 10: (10,1) to (10,11), (10,15) to (10,18)
Row 11: (11,1) to (11,13), (11,15) to (11,18)
Row 12: (12,1) to (12,13), (12,15) to (12,18)
Row 13: (13,1) to (13,18)
                                `},
                        {role:"user",content:prompt}
                        ],
                        stream: false, // get the full response at once
                        format: "json", // request a JSON response
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                console.log(response)

                const data = await response.json();
                console.log(data)
                const pathString = data.message.content; // The JSON string is in the 'response' field
                console.log(pathString)
                
                // Parse the JSON string into a JavaScript array
                const pathJson = JSON.parse(pathString);
                const tempPathJSON = []
                pathJson["path"].forEach((pos,idx)=>{
                    tempPathJSON.push({ x: pos.x * TILE_SIZE, y: pos.y * TILE_SIZE })
                }) 
                console.log(tempPathJSON)
                this.maryPath = tempPathJSON
                console.log("Path received:", this.maryPath);

                this.pathGenerated = true;
                // Set Mary's initial destination to the first point on the path

                console.log(this.maryPath["path"])
                if (this.maryPath.length > 0) {
                    this.mary.setDestination(this.maryPath[0].x, this.maryPath[0].y);
                }
                
            } catch (error) {
                console.error("Failed to fetch path from Ollama:", error);
                // Fallback to a hardcoded path if the request fails
                this.maryPath = [
                    { x: 3 * TILE_SIZE, y: 5 * TILE_SIZE },
                    { x: 5 * TILE_SIZE, y: 5 * TILE_SIZE },
                    { x: 5 * TILE_SIZE, y: 8 * TILE_SIZE },
                ];
                this.pathGenerated = true;
            }
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
            // if(this.eventTimer < this.eventInterval){
            //     this.eventTimer += deltaTime;
            //     this.eventUpdate = false;
            // }else{
            //     this.eventTimer = 0;
            //     this.eventUpdate = true;
            // }

            // Check if it's time to set the next waypoint
            if (this.eventTimer < this.eventInterval) {
                this.eventTimer += deltaTime;
                this.eventUpdate = false;
            } else {
                this.eventTimer = 0;
                this.eventUpdate = true;
            }
            
            // Logic to update Mary's destination based on the path
            const currentTime = performance.now();
            if (currentTime - this.lastWaypointTime > this.waypointInterval && this.mary.arrived) {
                this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.maryPath.length;
                const nextWaypoint = this.maryPath[this.currentWaypointIndex];
                
                this.mary.setDestination(nextWaypoint.x, nextWaypoint.y);
                this.lastWaypointTime = currentTime;
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