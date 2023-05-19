import { ReactNode } from "react";
import styles from "./styles.module.css";
import { Container } from "react-bootstrap";

interface MainProps {
  children: ReactNode;
}

export default function Main({ children }: MainProps) {
  return (
    <Container as="main" fluid>
      <Container>{children}</Container>
    </Container>
  );
}
