import { CirclePattern } from "./circle-pattern/CirclePattern";
import "./HeroPage.scss";

export const HeroPage: React.FC = () => {
  return (
    <div className="heroPage">
      <div className="mainContent">
        <div className="heroText">Lorem Ipsum Dolor Sit Amet consectetur</div>
        <div className="heroSubText">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste, doloremque consectetur distinctio odio a expedita sapiente.</div>
        <div className="heroButton">
          <button>Start Now</button>
        </div>
      </div>
      <div className="circle-pattern__left">
        <CirclePattern height={5} width={19} />
      </div>
      <div className="circle-pattern__right">
        <CirclePattern height={6} width={7} />
      </div>
      <img className="board-3d" alt="board" src="./board1.png"></img>
    </div>
  );
};
