import { CirclePattern } from "components/shared/circle-pattern/CirclePattern";
import { Navbar } from "./components/navigation/navbar/Navbar";
import { Routing } from "./Routing";
import "./App.scss";
import { useState } from "react";
import ErrorBoundary from "components/shared/error/ErrorBoundary";

function App() {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState<boolean>(false);

  return (
    <div className="app">
      <Navbar
        isBurgerMenuOpen={isBurgerMenuOpen}
        setIsBurgerMenuOpen={setIsBurgerMenuOpen}
      />
      <ErrorBoundary>
        <Routing />
        <div
          className={
            isBurgerMenuOpen
              ? "circle-pattern__left circle-pattern__burger"
              : "circle-pattern__left"
          }
        >
          <CirclePattern height={5} width={19} />
        </div>
        <div
          className={
            isBurgerMenuOpen
              ? "circle-pattern__right circle-pattern__burger"
              : "circle-pattern__right"
          }
        >
          <CirclePattern height={6} width={13} />
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
