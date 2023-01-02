import { useEffect, useRef } from "react";
import "./CirclePattern.scss";
import { gsap } from "gsap";

interface CirclePatternProps {
  height: number;
  width: number;
}

export const CirclePattern: React.FC<CirclePatternProps> = ({
  height,
  width,
}) => {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animation = gsap.context(() => {
      gsap.fromTo(
        ".circle",
        {
          opacity: 0,
        },
        {
          stagger: {
            each: 0.02,
          },
          opacity: 0.5,
        },
      );
    }, scope);

    return () => {
      animation.revert();
    };
  }, []);

  return (
    <div ref={scope} className="pattern-container">
      {[...Array(height)].map((x, i) => (
        <div className="pattern-row" key={i}>
          {[...Array(width)].map((x, i) => (
            <div className="circle" key={i}></div>
          ))}
        </div>
      ))}
    </div>
  );
};
