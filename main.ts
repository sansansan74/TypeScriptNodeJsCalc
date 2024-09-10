import { Console, log } from 'console';
import { Calculator } from './source/calculator.js';
import { calculateExpression, parseExpression } from './source/parse_expression.js';
import * as readline from 'readline';
import { ParseResult } from './source/gramatic.js';
import { PositionError } from './source/position_error.js';
import { printExpressionTree } from './source/print_expression.js';

// Функция для запроса ввода с использованием промисов
function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }
  

  function PrintCalculatedExpression(expression: string): void {
    const parseResult = parseExpression(expression)
    if (parseResult.errorMessage?.isError) {
        console.log(expression)
        PrintErrorPointer(parseResult.errorMessage.position);
        console.log(parseResult.errorMessage?.message)
        
        return
    }

    try {
        const calc = new Calculator(parseResult)
        printExpressionTree(parseResult.operationStack);

        const result = calc.Calculate()
        console.log(result)       
    } catch (error) {
        if (error instanceof PositionError) {
            console.log(error.message);
        } else {
            console.log('Произошла неизвестная ошибка');
        }
    }
    // выражение корректно. Будем его вычислять
}


function PrintErrorPointer(position: number) {
    console.log('_'.repeat(position - 1) + '^');
}

  // Асинхронная функция для работы с вводом
async function main() {
  while (true) {
    const expression = await askQuestion('Введите выражение для вычисления, например 2*(6-3)/(2+1) и нажмите ENTER\nДля завершения введите exit: ');
    if (expression.toLowerCase() === 'exit')
      break;

    console.log(`Вы ввели: ${expression}`);
  
    PrintCalculatedExpression(expression)
    console.log('\n=========================================================\n')    
  }

  }
  // Запуск программы
  main();