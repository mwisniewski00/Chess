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
      <div className="gifGrid"></div>
    </div>
  );
};
