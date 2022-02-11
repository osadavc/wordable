import { useEffect, useRef } from "react";

const usePrevious = <T extends unknown>(value: T): T => {
  const ref: any = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
