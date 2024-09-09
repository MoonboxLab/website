import { ReactNode } from "react";
import "./globals.css";
import "core-js/features/object/has-own";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
