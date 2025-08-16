import { ROWS, COLS, TILE_SIZE } from "./main.js";

// A new class to represent a collision layer
class CollisionLayer {
    constructor(data) {
        this.data = data;
    }

    // Get the value of a tile at a specific row and column
    getTile(row, col) {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
            return -1; // Return -1 for out-of-bounds
        }
        return this.data[COLS * row + col];
    }

    // Get the entire collision layer data
    getCollisionLayer() {
        return this.data;
    }

    // Get an array of available cells (where the value is 0)
    getAvailableCells() {
        const availableCells = [];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.getTile(row, col) === 0) {
                    availableCells.push({ row, col });
                }
            }
        }
        return availableCells;
    }
}

export class World {
    constructor() {
        // Define the collision data array separately
        const collisionData = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];

        this.level1 = {
            waterLayer: [],
            groundLayer: [],
            // Instantiate the new CollisionLayer class
            collisionLayer: new CollisionLayer(collisionData),
            backgroundLayer: document.getElementById('bg'),
        };
    }

    // The getTile method now works directly with the CollisionLayer class
    getTile(row, col) {
        return this.level1.collisionLayer.getTile(row, col);
    }

    // New method to get the collision data from the CollisionLayer class
    getCollisionLayer() {
        return this.level1.collisionLayer.getCollisionLayer();
    }

    // New method to get available cells from the CollisionLayer class
    getAvailableCells() {
        return this.level1.collisionLayer.getAvailableCells();
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBackground(ctx) {
        ctx.drawImage(this.level1.backgroundLayer, 0, 0);
    }

    drawcollisonMap(ctx) {
        ctx.fillStyle = 'rgba(0,0,255,0.5)';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.getTile(row, col) === 1) {
                    ctx.fillRect(
                        col * TILE_SIZE,
                        row * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE
                    );
                }
            }
        }
    }

    drawGrid(ctx) {
        ctx.strokeStyle = 'black';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                ctx.strokeRect(
                    col * TILE_SIZE,
                    row * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );
            }
        }
    }
}