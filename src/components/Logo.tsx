import type { JSX } from "react";
import LogoImg from "../assets/Logo.webp";

export default function Logo(): JSX.Element {
  return <img className="logo" src={LogoImg} alt="Tom The Shop logo" />;
}
