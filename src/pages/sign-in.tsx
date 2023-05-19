import Header from "@components/Header";
import { signIn } from "@helpers/api";
import { useAppSelector } from "@helpers/store/hooks";
import Main from "@components/Main";
import { useRouter } from "next/router";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Card, Form, Button, Stack } from "react-bootstrap";
import Link from "next/link";

export default function SignInPage() {
  const [data, setData] = useState<{ [key: string]: string }>({});
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await signIn(data.email, data.password);
    router.push("/profile");
  }

  return (
    <>
      <Header isShowedAuthButtons={false} />
      <Main>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Card.Title className="mb-4">Вход</Card.Title>
              <Stack className="mb-4" gap={2}>
                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="email"
                    onChange={handleChange}
                    value={data.email ?? ""}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={handleChange}
                    value={data.password ?? ""}
                  />
                </Form.Group>
              </Stack>
              <div>
                <Button className="me-2" variant="primary" type="submit">
                  Войти
                </Button>
                <Link href="/sign-up">
                  <Button variant="link">Зарегистрироваться</Button>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Main>
    </>
  );
}
