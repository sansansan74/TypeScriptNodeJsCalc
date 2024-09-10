# TypeScriptNodeJsCalc
Simple calculator written on TypeScript

# Installation
If you don't have NodeJS, install NodeJS (from his site)

1. Download project
2. Open terminal in project root folder
3. Execute in terminal `npm install`
4. Execute in terminal `npx tsc`
5. Execute in terminal `node ./dist/main.js`
6. Программа попросит вас ввести выражение для вычисления, выведет дерево выражения и ответ. Пример работы программы приведен ниже.
```
C:\sansan\Projects\TYPESCRIPT\TypeScriptNodeJsCalc>node ./dist/main.js
Введите выражение для вычисления, например 2*(6-3)/(2+1) и нажмите ENTER
Для завершения введите exit: 2*(6-3)/(2+1)
Вы ввели: 2*(6-3)/(2+1)
├── Operation(/)
│   ├── Number(1)
│   └── Operation(+)
│       ├── Operation(*)
│       │   ├── Number(3)
│       │   └── Operation(-)
│       │       ├── Number(2)
│       │       └── Number(6)
│       └── Number(2)
2
```
