/* 
e = s
s = [-]m {+- m}
m = a {/* a}
a = num{!} | (s){!}
num = d{d}
*/

import { LexParser } from "./lex_parser.js";
import { Lex, LexNumber, LexOperation, LexSpecial, LexEval, LexEOF } from "./lex.js";
import { PositionError } from "./position_error.js";

interface ErrorMessage {
    isError: boolean;
    position : number;
    message: string;
}

export interface ParseResult {
    errorMessage: ErrorMessage | undefined;
    operationStack: Array<LexEval>;
}

export class ExpressionAnalizer {
    parser: LexParser
    lex: Lex | undefined
    parseResult: ParseResult

    constructor(expr: string) {
        this.parser = new LexParser(expr)
        this.parseResult = {
            errorMessage: undefined,
            operationStack: []
        }
    }

    public Analize(): ParseResult {
        try {
            this.readLex()
            this.readExpr()           
        } catch (e) {
            this.parseResult.errorMessage = {
                isError: true,
                position: this.parser.getPosition()+1,
                message: (e as PositionError).message
            }
        }

        return this.parseResult
    }

    private readLex() {
        this.lex = this.parser.getLex()
    }

    private readExpr() {
        this.readSum()
        if (this.lex instanceof LexEOF) {
            return;
        }

        throw new PositionError(`Неожиданные данные после конца выражения в позиции ${this.parser.getPosition()}`, 
                                this.parser.getPosition());
    }

    private readSum() {
        let unaryMinus = false
        // s = [-]m {+- m}
        if (this.isCurrentLexOperation() && this.getCurrentLexOperation() === '-') {
            this.parseResult.operationStack.push( 
                new LexNumber(
                    0, 
                    this.parser.getPosition(), 
                    this.parser.getPosition())
                )

            unaryMinus = true
            this.readLex()
        }  

        this.readMult();

        if (unaryMinus) {
            this.parseResult.operationStack.push(
                new LexOperation(
                    '-',
                    this.parser.getPosition(),
                    this.parser.getPosition()
                ))
        }

        while(this.isCurrentLexOperation()) {
            const op = <LexOperation>this.lex
            if (op.operation !== '+' && op.operation !== '-') {
                break;
            }
            
            this.readLex()
            this.readMult()
            this.parseResult.operationStack.push(op)          
        }  
    }

    private readMult() {
        // m = a {*/ a}
        this.readAtom();

        while(this.isCurrentLexOperation()) {
            const op = <LexOperation>this.lex
            if (op.operation !== '*' && op.operation !== '/') {
                break;
            }
            
            this.readLex()
            this.readAtom()
            this.parseResult.operationStack.push(op)          
        }  
    }

    isCurrentLexOperation(): boolean {
        return this.lex instanceof LexOperation
    }

    getCurrentLexOperation(): string {
        return (<LexOperation>this.lex).operation
    }

    private readAtom() {
        // a = num | (s) | num {!} | (s) {!}
        if (this.lex instanceof LexNumber) {
            this.readNumber()

            this.TryReadFactorial()
            return 
        }

        if (this.lex instanceof LexSpecial) {
            this.readBraces()

            this.TryReadFactorial()
            return           
        }

        throw new PositionError('Ожидалось число или выражение в скобках', 
                                this.lex?.startPosition);
        
    }

    private TryReadFactorial() {
        while (this.isCurrentLexOperation() && this.getCurrentLexOperation() === '!') {
            this.parseResult.operationStack.push(<LexOperation>this.lex);
            this.readLex();
        }
    }

    private readBraces() {
        const openBrace = <LexSpecial>this.lex;
        if (openBrace.sym === '(') {
            this.readLex()
            this.readSum();
            if (this.lex instanceof LexSpecial) {
                const closeBrace = <LexSpecial>this.lex;
                if (closeBrace.sym === ')') {
                    this.readLex()
                    return
                }         
            } 
                
            throw new PositionError(`Нет парной закрывающей скобки к открывающей скобке в позиции ${openBrace.startPosition}`,
                this.lex?.startPosition
            );
        }
    }

    private readNumber() {
        const numLex = <LexNumber>this.lex;
        this.parseResult.operationStack.push(numLex);
        this.readLex()
        return;
    }
}


