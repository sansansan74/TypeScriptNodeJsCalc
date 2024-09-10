// Class describes error with position. If you parse expression, 
// you need tell to user about error and position, where error occured

export class PositionError extends Error {
    position: number;

    constructor(message: string, position: number = -1) {
        super(message);
        this.position = position;
    }
}