class Piece {
    constructor (id, originX, originY, moveArray, spriteX, spriteY) {
        this.id = id;
        this.originX = originX;
        this.originY = originY;
        this.moveArray = moveArray;
        this.spriteX = spriteX;
        this.spriteY = spriteY;

        this.previousPos = null;
    }

    getSpriteCoord () {
        return [this.spriteX, this.spriteY];
    }

    getId () {
        return this.id;
    }

    getMoves () {
        return this.moveArray;
    }

    updatePrevious (x, y) {
        this.hasMoved = true;
        this.previousPos = [x, y];
    }
}

export default Piece;
