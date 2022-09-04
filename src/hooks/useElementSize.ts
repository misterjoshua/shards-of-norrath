import { useRef, useState, useEffect } from 'react';

export function useElementSize<T extends HTMLElement>(): [React.RefObject<T>, number, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.clientWidth);
    setHeight(ref.current.clientHeight);
  }, [setHeight, setWidth, ref]);

  return [ref, width, height];
}
