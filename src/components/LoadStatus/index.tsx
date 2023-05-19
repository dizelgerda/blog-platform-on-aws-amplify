import { Row, Spinner } from "react-bootstrap";

export default function LoadStatus() {
  return (
    <>
      <Row className="mb-2 justify-content-center">
        <Spinner animation="border" role="status" />
      </Row>
      <Row className="justify-content-center">Загружаем данные...</Row>
    </>
  );
}
