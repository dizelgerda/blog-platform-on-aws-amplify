import Link from "next/link";
import { useAppSelector } from "@helpers/store/hooks";

import {
  Button,
  Container,
  Navbar,
  OverlayTrigger,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { Blog } from "@helpers/types/graphql";
import { signOut } from "@helpers/api";
import { useRouter } from "next/router";

interface HeaderProps {
  isShowedAuthButtons?: boolean;
}

export default function Header({ isShowedAuthButtons = true }: HeaderProps) {
  const { currentBlog, isLoggedIn } = useAppSelector((store) => store.app);
  const router = useRouter();

  async function handleLogOut() {
    await signOut();
    router.push("/");
  }

  function renderCreateButton() {
    if ((currentBlog as Blog).id) {
      return (
        <Link href="/posts/edit">
          <Button variant="outline-primary">Создать</Button>
        </Link>
      );
    }

    return (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Блог не выбран</Tooltip>}
      >
        <div>
          <Button variant="outline-primary" disabled={true}>
            Создать
          </Button>
        </div>
      </OverlayTrigger>
    );
  }

  return (
    <Container as="header" fluid className="bg-white mb-4">
      <Container>
        <Navbar>
          <Stack gap={2}>
            <Navbar.Collapse>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Navbar.Brand>Блог-платформа</Navbar.Brand>
              </Link>

              {isLoggedIn ? renderCreateButton() : null}

              <Stack className="ms-auto" direction="horizontal" gap={2}>
                {isLoggedIn ? (
                  <>
                    <Link href="/profile">
                      <Button variant="link">Профиль</Button>
                    </Link>
                    <Button variant="link" onClick={handleLogOut}>
                      Выйти
                    </Button>
                  </>
                ) : (
                  <>
                    {isShowedAuthButtons ? (
                      <Link href="/sign-in">
                        <Button variant="outline-primary">Войти</Button>
                      </Link>
                    ) : null}
                  </>
                )}
              </Stack>
            </Navbar.Collapse>

            {(currentBlog as Blog).id ? (
              <Navbar.Collapse>
                <Navbar.Text>
                  Текущий блог:{" "}
                  <Link href={`/blogs/${(currentBlog as Blog).id}`}>
                    {(currentBlog as Blog).name}
                  </Link>
                </Navbar.Text>
                <Link href="/profile">
                  <Button
                    className="ms-2"
                    variant="outline-secondary"
                    size="sm"
                  >
                    Изменить
                  </Button>
                </Link>
              </Navbar.Collapse>
            ) : null}
          </Stack>
        </Navbar>
      </Container>
    </Container>
  );
}
