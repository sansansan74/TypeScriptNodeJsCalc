import { ExpressionAnalizer, ParseResult } from "./gramatic";
import { LexEval, LexNumber, LexOperation } from "./lex";

export function printExpressionTree(originalStack: LexEval[]): void {
    const stack = originalStack.map(lexEval => lexEval)

    if (stack.length === 0) {
        console.log("Empty expression.");
        return;
    }

    // Вспомогательная рекурсивная функция для печати дерева
    function printNode(node: LexEval, prefix: string = "", isLeft: boolean = true): void {
        if (node instanceof LexNumber) {
            console.log(`${prefix}${isLeft ? "├── " : "└── "}Number(${node.num})`);
        } else if (node instanceof LexOperation) {
            console.log(`${prefix}${isLeft ? "├── " : "└── "}Operation(${node.operation})`);

            // Вытаскиваем операнды из стека
            const rightOperand = stack.pop();
            const leftOperand = stack.pop();

            if (leftOperand) {
                printNode(leftOperand, prefix + (isLeft ? "│   " : "    "), true);
            }
            if (rightOperand) {
                printNode(rightOperand, prefix + (isLeft ? "│   " : "    "), false);
            }
        }
    }

    // Получаем корневой узел выражения (последний элемент в стеке)
    const root = stack.pop();

    if (root) {
        printNode(root);
    } else {
        console.log("No valid expression to print.");
    }
}

// // Пример использования:
// const expressionAnalizer = new ExpressionAnalizer("3 + 5 * (2 - 1)");
// const parseResult = expressionAnalizer.Analize();
// printExpressionTree(parseResult);
