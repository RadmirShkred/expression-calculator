function eval() {
    // Do not use eval!!!
    return;
}

const expressionCalculator = (str) => {
    const operations = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => {
            if (b === 0) {
               throw 'TypeError: Division by zero.';
            }
            return (a / b);
        }
    }
    const operators = Object.keys(operations);
    const doExpr = (expr) => {
        for (let operator of operators) {
            let regexPattern = `(?!^)(?<!\\${operators.map(el => '\\' + el).join('|')})\\${operator}`;
            let found = [...expr.matchAll(new RegExp(regexPattern, 'g'))];
            let matchedOperation = found[found.length - 1];
            if (matchedOperation) {
                let x = expr.slice(0, matchedOperation.index);
                let y = expr.slice(matchedOperation.index + 1);

                return y ? operations[matchedOperation[0]](doExpr(x), doExpr(y)) : x;
            }
        }
        return +expr;
    }
    const calculate = (str) => {
        str = str.replace(/\s/g, '');
        let stack = [];

        for (let i = 0; i < str.length; i++) {
            if (str[i] === ')') {
                if (!stack.length) {
                    throw "ExpressionError: Brackets must be paired";
                }
                let toCalculate = str.slice(stack[stack.length - 1] + 1, i);
                let calculated = doExpr(toCalculate);
                str = str.slice(0, stack[stack.length - 1]) + calculated + str.slice(i + 1);
                i = stack.pop();
            } else if (str[i] === '(') {
                stack.push(i);
            }
        }
        if (stack.length) {
            throw "ExpressionError: Brackets must be paired";
        }
        return doExpr(str);
    }
    return calculate(str);
}

module.exports = {
    expressionCalculator
}
