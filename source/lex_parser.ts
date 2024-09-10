import { Lex, LexEOF, LexNumber, LexOperation, LexSpecial } from "./lex.js";
import { PositionError } from "./position_error.js";

export class LexParser {
    position: number;
    constructor(public expr: string) {
        this.position = 0;
    }

    public getLex(): Lex {
        this.skipSpaces();

        const startPosition = this.position

        if (this.position >= this.expr.length)
            return new LexEOF(this.position);

        const ch = this.expr[this.position];

        if (this.isNumeric(ch)) {
            return this.readNumber();
        }

        switch (ch) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '!':
                this.position++;
                return new LexOperation(ch, startPosition, this.position);

            case '(':
            case ')':
                this.position++;
                return new LexSpecial(ch, startPosition, this.position);
        }

        throw new PositionError(`Некорректный символ [${ch}] в позиции ${this.position}`, 
                                this.position);
    }

    public getPosition() { 
        return this.position 
    }

    private readNumber(): LexNumber {
        // find last numeric symbol in expr
        const startPosition = this.position

        let index = this.position
        for (; index < this.expr.length; index++) {
            if (!this.isNumeric(this.expr[index]))
                break
        }
        const strNum = this.expr.substring(this.position, index)
        this.position = index;

        return new LexNumber(+strNum, startPosition, this.position);
    }

    private isNumeric(ch: string): boolean {
        return /\d/.test(ch);
    }

    private skipSpaces() {
        for (;this.position < this.expr.length; this.position++) {
            if (!this.isWhitespace(this.expr[this.position])) {
                return;
            }
        }
    }

    private isWhitespace(c: string) {
        return c === ' '
            || c === '\n'
            || c === '\t'
            || c === '\r'
            || c === '\f'
            || c === '\v'
            || c === '\u00a0'
            || c === '\u1680'
            || c === '\u2000'
            || c === '\u200a'
            || c === '\u2028'
            || c === '\u2029'
            || c === '\u202f'
            || c === '\u205f'
            || c === '\u3000'
            || c === '\ufeff'
    }
}
