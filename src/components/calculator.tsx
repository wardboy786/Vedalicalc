"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

type Operation = '+' | '-' | '*' | '/';

const formatOperand = (operand: string | null) => {
  if (operand === null) return '';
  if (operand === "Error") return "Error";
  if (operand.includes('e')) return operand;
  
  const [integer, decimal] = operand.split('.');
  if (!integer) return '0';

  try {
    const formattedInteger = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(parseFloat(integer));
    
    if (decimal !== undefined) {
      return `${formattedInteger}.${decimal}`;
    }
    return formattedInteger;
  } catch (e) {
    return operand;
  }
};


export function Calculator() {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState<string | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [overwrite, setOverwrite] = useState(false);

  const clear = () => {
    setCurrentOperand('0');
    setPreviousOperand(null);
    setOperation(null);
    setOverwrite(false);
  };
  
  const addDigit = (digit: string) => {
    if (overwrite) {
      setCurrentOperand(digit);
      setOverwrite(false);
      return;
    }
    if (digit === '0' && currentOperand === '0') return;
    if (digit === '.' && currentOperand.includes('.')) return;
    if (currentOperand.length >= 15) return;

    setCurrentOperand(current => (current === '0' && digit !== '.' ? digit : `${current}${digit}`));
  };

  const chooseOperation = (op: Operation) => {
    if (currentOperand === "Error") clear();
    if (currentOperand === '0' && previousOperand === null) return;
    
    if (previousOperand !== null && !overwrite) {
      compute(true);
    }

    setOperation(op);
    setPreviousOperand(currentOperand);
    setCurrentOperand('0');
    setOverwrite(false);
  };

  const compute = (isChained: boolean = false) => {
    if (operation === null || previousOperand === null) return;

    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    let result: number;
    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          setCurrentOperand("Error");
          setPreviousOperand(null);
          setOperation(null);
          setOverwrite(true);
          return;
        }
        result = prev / current;
        break;
    }
    
    const resultString = result.toString();
    setCurrentOperand(resultString.length > 15 ? result.toPrecision(10) : resultString);
    if (!isChained) {
        setOperation(null);
        setPreviousOperand(null);
        setOverwrite(true);
    }
  };

  const clearText = useMemo(() => {
    return currentOperand !== '0' && !overwrite ? 'C' : 'AC';
  }, [currentOperand, overwrite]);

  const handleClear = () => {
    if (clearText === 'C') {
      setCurrentOperand('0');
      setOverwrite(false);
    } else {
      clear();
    }
  };

  return (
    <div className="bg-card p-4 rounded-2xl shadow-2xl w-full max-w-xs space-y-4">
      <h1 className="text-xl font-bold text-center font-headline text-primary/80">
        VerdantCalc
      </h1>

      <div className="bg-background text-right rounded-lg p-4 space-y-1 overflow-hidden">
        <div className="text-muted-foreground text-xl h-7 break-all truncate">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="text-foreground text-5xl font-bold break-all min-h-[60px]">
          {formatOperand(currentOperand)}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button onClick={handleClear} variant="secondary" className="col-span-3 text-2xl py-6">
          {clearText}
        </Button>
        <Button onClick={() => chooseOperation('/')} variant="default" className="text-2xl py-6">
          &divide;
        </Button>

        {['7', '8', '9'].map(digit => (
          <Button key={digit} onClick={() => addDigit(digit)} variant="outline" className="text-2xl py-6 border-2">
            {digit}
          </Button>
        ))}
        <Button onClick={() => chooseOperation('*')} variant="default" className="text-2xl py-6">
          &times;
        </Button>

        {['4', '5', '6'].map(digit => (
          <Button key={digit} onClick={() => addDigit(digit)} variant="outline" className="text-2xl py-6 border-2">
            {digit}
          </Button>
        ))}
        <Button onClick={() => chooseOperation('-')} variant="default" className="text-2xl py-6">
          &minus;
        </Button>

        {['1', '2', '3'].map(digit => (
          <Button key={digit} onClick={() => addDigit(digit)} variant="outline" className="text-2xl py-6 border-2">
            {digit}
          </Button>
        ))}
        <Button onClick={() => chooseOperation('+')} variant="default" className="text-2xl py-6">
          +
        </Button>

        <Button onClick={() => addDigit('0')} variant="outline" className="col-span-2 text-2xl py-6 border-2">
          0
        </Button>
        <Button onClick={() => addDigit('.')} variant="outline" className="text-2xl py-6 border-2">
          .
        </Button>
        <Button onClick={() => compute()} className="text-2xl py-6 bg-accent text-accent-foreground hover:bg-accent/90">
          =
        </Button>
      </div>
    </div>
  );
}
