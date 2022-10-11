import "./CirclePattern.scss";

interface CirclePatternProps {
  height: number;
  width: number;
}

export const CirclePattern: React.FC<CirclePatternProps> = ({
  height,
  width,
}) => {
  return (
    <div className="pattern-container">
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
