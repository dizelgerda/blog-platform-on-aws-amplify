import Header from "@components/Header";
import Main from "@components/Main";
import { confirmSignUp, signUp } from "@helpers/api";
import { useAppSelector } from "@helpers/store/hooks";
import { PlainObject } from "@helpers/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Offcanvas,
  Stack,
} from "react-bootstrap";

export default function SignUpPage() {
  const [data, setData] = useState<PlainObject>({});
  const [isShowedSidebar, setIsShowedSidebar] = useState<boolean>(false);
  const { isLoggedIn } = useAppSelector((store) => store.app);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.isReady && router.replace("/");
    }
  }, [isLoggedIn]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function handleCloseSidebar() {
    setIsShowedSidebar(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    signUp(data.email, data.password);
  }

  async function handleConfirmEmail() {
    await confirmSignUp(data.email, data.confirmation_code);
    router.push("/sign-in");
  }

  return (
    <>
      <Header isShowedAuthButtons={false} />
      <Main>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Card.Title className="mb-4">Регистрация</Card.Title>
              <Stack className="mb-4" gap={2}>
                <Form.Group>
                  <Form.Label>Адрес электронной почты</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Введите адрес электронной почты"
                    onChange={handleChange}
                    value={data.email ?? ""}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Введите"
                    onChange={handleChange}
                    value={data.password ?? ""}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Подтвердите пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="repeated_password"
                    placeholder="Повторите пароль"
                    onChange={handleChange}
                    value={data.repeated_password ?? ""}
                  />
                </Form.Group>
              </Stack>
              <div>
                <Button className="me-2" variant="primary" type="submit">
                  Зарегистрироваться
                </Button>
                <Link href="/sign-in">
                  <Button variant="link">Войти</Button>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <Offcanvas
          placement="end"
          backdrop="static"
          show={isShowedSidebar}
          onHide={handleCloseSidebar}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Подтвердите электронную почту</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Код подтверждения</Form.Label>
                <Form.Control
                  type="number"
                  name="confirmation_code"
                  value={data.confirmation_code ?? ""}
                />
                <Form.Text>
                  Мы отправили электронное письмо с кодом на {data.email}.
                </Form.Text>
              </Form.Group>
              <div>
                <Button
                  className="me-2"
                  variant="primary"
                  onClick={handleConfirmEmail}
                >
                  Подтвердить
                </Button>
                <Button variant="link" onClick={handleCloseSidebar}>
                  Назад
                </Button>
              </div>
            </Form>
          </Offcanvas.Body>
        </Offcanvas>
      </Main>
    </>
  );
}
