import React from "react";
import "./HeroPage.scss";

interface HeroPageProps {}

export const HeroPage: React.FC<HeroPageProps> = ({}) => {
  return <div className="heroPage">
    <div className="leftSide"></div>
    <div className="rightSide"></div>
  </div>;
};
