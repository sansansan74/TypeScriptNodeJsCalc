import { Calculator } from "./calculator.js";
import { ParseResult, ExpressionAnalizer } from "./gramatic.js";
import { PositionError } from "./position_error.js";

export function parseExpression(expression: string): ParseResult {
    const expressionAnalizer = new ExpressionAnalizer(expression);
    const parseResult = expressionAnalizer.Analize();
    return parseResult;
}

export function calculateExpression(expression: string): number {
    const parseResult = parseExpression(expression)
    if (parseResult.errorMessage?.isError) {
        throw new PositionError(parseResult.errorMessage?.message);
    }

    const calc = new Calculator(parseResult)
    const result = calc.Calculate()
    return result
}
