import { ParseResult } from "./gramatic.js";
import { LexNumber, LexOperation } from "./lex.js";
import { PositionError } from "./position_error.js";


export class Calculator {
    constructor( public parseResult: ParseResult  ) {

    }

    public Calculate(): number {
        if (this.parseResult.errorMessage?.isError) {
            throw new PositionError(this.parseResult.errorMessage.message, 
                this.parseResult.errorMessage.position);           
        }

        const stack = this.Interpretate();

        // Если все нормально, то в стеке должно быть только одно число
        if (stack.length !== 1) {
            throw new PositionError(`После вычисления в стеке д.б. только 1 элемент - результат. Lenth=${stack.length}`);
        }
        
        return stack.pop()!
    }

    private Interpretate(): number[] {
        const stack: number[] = [];

        for (let i = 0; i < this.parseResult.operationStack.length; i++) {
            const lex = this.parseResult.operationStack[i];

            if (lex instanceof LexNumber) {
                stack.push((<LexNumber>lex).num);
                continue;
            }

            if (!(lex instanceof LexOperation)) {
                throw new PositionError(`Недопустимая лексема по индексу ${i}`);
            }

            const oper = (<LexOperation>lex)
            
            try {
                const res = this.CalculateOperation(oper.operation, stack);           
                stack.push(res);               
            } catch (err) {
                if (err instanceof PositionError) {
                    throw new PositionError(`${err.message} в позиции ${oper.startPosition}`, oper.startPosition);
                }

                throw err                              
            }
        }

        return stack
    }

    private CalculateOperation(operation: string, stack: number[]): number {
        if (operation === '!') {
            const op1 = stack.pop();
            return this.EvalFactorial(op1!);
        } else {
            const op2 = stack.pop();
            const op1 = stack.pop();
            return this.EvalOperation(op1!, op2!, operation);
        }

    }

    private EvalFactorial(op1: number): number {
        if (op1 < 0) {
            throw new PositionError(`Параметр факториала должен быть положительным ${op1}`); 
        }
        let rval = 1
        for (let i = 2; i <= op1; i++) {
            rval = rval * i
        }       
        
        return rval;
    }

    private EvalOperation(op1:number, op2:number, operation: string): number {
        switch(operation) {
            case '+':
                return op1+op2

            case '-':
                return op1-op2

            case '*':
                return op1*op2

            case '/':
                if (op2 === 0) {
                    throw new PositionError('Нельзя делить на 0')
                }
                return op1/op2         
        }

        throw new PositionError(`Некорректная операция [${operation}]`);
      
    }
}