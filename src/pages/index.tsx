import Header from "@components/Header";
import LoadStatus from "@components/LoadStatus";
import Main from "@components/Main";
import {
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";

export default function MainPage() {
  return (
    <>
      <Header />
      <Main>
        <LoadStatus></LoadStatus>
      </Main>
    </>
  );
}
