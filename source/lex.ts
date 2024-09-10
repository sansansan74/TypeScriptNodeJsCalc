
export class Lex {
    constructor(public startPosition: number, public finishPosition: number) {

    }
}

export class LexEval extends Lex {
    constructor(startPosition: number, finishPosition: number) {
        super(startPosition, finishPosition)
    }
}

export class LexNumber extends LexEval {
    constructor(
        public num: number, 
        startPosition: number, 
        finishPosition: number) 
    {
        super(startPosition, finishPosition)
    }   
}

export class LexOperation extends LexEval {
    constructor(
        public operation: string, 
        startPosition: number, 
        finishPosition: number) 
    {
        super(startPosition, finishPosition)
    }
}

export class LexSpecial extends Lex {
    constructor(public sym: string, startPosition: number, finishPosition: number) {
        super(startPosition, finishPosition)
    }
}

export class LexEOF extends Lex {
    constructor(startPosition: number) {
        super(startPosition, startPosition);
    }
}