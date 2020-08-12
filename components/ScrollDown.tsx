import { useEffect, useState } from "react";
import styled from "@emotion/styled";

export const useScrollPosition = (callback) => {
  const handleScroll = () => {
    callback(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
};

const ScrollDownItem = styled.span`
  @media only screen and (min-height: 900px) {
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 46px;
    height: 46px;
    margin-left: -23px;
    box-sizing: border-box;
    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      content: "";
      width: 16px;
      height: 16px;
      margin: -12px 0 0 -8px;
      border-left: 2px solid rgba(0, 0, 0, 0.2);
      border-bottom: 2px solid rgba(0, 0, 0, 0.2);
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      box-sizing: border-box;
      transition: 0.4s ease-in-out;
    }
    &:hover {
      &::after {
        border-color: rgba(0, 0, 0, 0);
      }
    }
  }
`;

const ScrollDown = () => {
  const [offset, setOffset] = useState(0);

  const handleScroll = () => {
    setOffset(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  if (offset > 0) return null;
  return <ScrollDownItem />;
};

export default ScrollDown;
