import "./HeroPage.scss";
import boardImg from "./board1.png";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroButton from "./hero-button/HeroButton";

export const HeroPage: React.FC = () => {
  const scope = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const animation = gsap.context(() => {
      gsap
        .timeline({ repeat: -1 })
        .fromTo(
          ".board-3d",
          {
            y: -20,
            visibility: 1,
          },
          {
            duration: 2.5,
            ease: "power1.inOut",
            y: 20,
          },
        )
        .fromTo(
          ".board-3d",
          {
            y: 20,
          },
          {
            duration: 2.5,
            ease: "power1.inOut",
            y: -20,
          },
        );
    }, scope);

    return () => {
      animation.revert();
    };
  }, []);

  return (
    <div ref={scope} className="hero-page">
      <div className="main-content">
        <div className="hero-text">Lorem Ipsum Dolor Sit Amet consectetur</div>
        <div className="hero-sub-text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste,
          doloremque consectetur distinctio odio a expedita sapiente.
        </div>
        <HeroButton />
      </div>
      <img className="board-3d" alt="board" src={boardImg}></img>
    </div>
  );
};
