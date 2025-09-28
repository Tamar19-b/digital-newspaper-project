import { useEffect, useRef, useState } from "react";

const Counter = ({ target }: { target: number | string }) => {
  const [count, setCount] = useState<string | number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isNumeric = typeof target === 'number';

  useEffect(() => {
    const targetNumber = isNumeric ? target : parseFloat(target.toString().replace(/[^0-9.]/g, ''));
    const increment = targetNumber / 90;
    let current = 0;

    intervalRef.current = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        clearInterval(intervalRef.current!);
        setCount(target);
      } else {
        setCount(isNumeric ? Math.floor(current) : `${Math.floor(current)}K`);
      }
    }, 40);

    return () => clearInterval(intervalRef.current!);
  }, [target]);

  return <div className="kpi-value">{count}</div>;
};
export default Counter;