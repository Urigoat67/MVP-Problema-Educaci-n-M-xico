// Parse elementary arithmetic without executing user-provided code.
export function calculate(expression: string) {
  if (expression.length > 120) throw Error();
  const source = expression.replace(/\s+/g, '').replace(/,/g, '.').replace(/×/g, '*').replace(/[÷]/g, '/').replace(/−/g, '-');
  const tokens = source.match(/\d+(?:\.\d*)?|\.\d+|[+*/()-]/g) || [];
  if (!tokens.length || tokens.join('') !== source) throw Error();
  let index = 0;

  function factor(): number {
    const token = tokens[index++];
    if (token === '+') return factor();
    if (token === '-') return -factor();
    if (token === '(') {
      const value = sum();
      if (tokens[index++] !== ')') throw Error();
      return value;
    }
    if (token === undefined || !/^\d|^\.\d/.test(token)) throw Error();
    return Number(token);
  }

  function product(): number {
    let value = factor();
    while (tokens[index] === '*' || tokens[index] === '/') {
      const operator = tokens[index++];
      const operand = factor();
      value = operator === '*' ? value * operand : value / operand;
    }
    return value;
  }

  function sum(): number {
    let value = product();
    while (tokens[index] === '+' || tokens[index] === '-') {
      const operator = tokens[index++];
      const operand = product();
      value = operator === '+' ? value + operand : value - operand;
    }
    return value;
  }

  const result = sum();
  if (index !== tokens.length || !Number.isFinite(result)) throw Error();
  return new Intl.NumberFormat('es-MX', { maximumSignificantDigits: 12 }).format(result);
}

