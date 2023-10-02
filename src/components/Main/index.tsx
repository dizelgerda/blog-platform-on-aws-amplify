import { useAppSelector, useAppDispatch } from "@helpers/store/hooks";
import { removeAlert } from "@helpers/store/slices/alert";
import { ReactNode, useEffect } from "react";
import { Alert, Container } from "react-bootstrap";

interface MainProps {
  children: ReactNode;
}

export default function Main({ children }: MainProps) {
  const { alert } = useAppSelector((store) => store.app);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        dispatch(removeAlert());
      }, 5000);
    }
  }, [alert]);

  return (
    <Container as="main" fluid>
      <Container>{children}</Container>

      {alert ? (
        <Container className="position-fixed bottom-0 start-50 translate-middle-x">
          <Alert variant={alert.type}>{alert.message}</Alert>
        </Container>
      ) : null}
    </Container>
  );
}
