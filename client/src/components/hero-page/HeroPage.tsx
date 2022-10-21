import { CirclePattern } from "./circle-pattern/CirclePattern";
import "./HeroPage.scss";
import boardImg from "./board1.png";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import useRefreshToken from "hooks/useRefreshToken";
import useAxiosPrivate from "hooks/useAxiosPrivate";

export const HeroPage: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();


  const test = async () => {
    try {
      const response = await axiosPrivate.get("/users");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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
    <div ref={scope} className="hero-page">
      <div className="main-content">
        <div className="hero-text">Lorem Ipsum Dolor Sit Amet consectetur</div>
        <div className="hero-sub-text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste,
          doloremque consectetur distinctio odio a expedita sapiente.
        </div>
        <div className="hero-button">
          <button onClick={() => test()}>Start Now</button>
        </div>
      </div>
      <div className="circle-pattern__left">
        <CirclePattern height={5} width={19} />
      </div>
      <div className="circle-pattern__right">
        <CirclePattern height={6} width={7} />
      </div>
      <img className="board-3d" alt="board" src={boardImg}></img>
    </div>
  );
};
