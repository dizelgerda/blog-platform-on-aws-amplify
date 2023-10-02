import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@helpers/store/hooks";

import {
  Button,
  CloseButton,
  Container,
  Navbar,
  OverlayTrigger,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { Blog } from "@helpers/types/graphql";
import { signOut } from "@helpers/api";
import { useRouter } from "next/router";
import { removeCurrentBlog } from "@helpers/store/slices/currentBlog";

interface HeaderProps {
  isShowedAuthButtons?: boolean;
}

export default function Header({ isShowedAuthButtons = true }: HeaderProps) {
  const { currentBlog, isLoggedIn } = useAppSelector((store) => store.app);
  const router = useRouter();
  const dispatch = useAppDispatch();

  async function handleLogOut() {
    await signOut();
    router.push("/");
  }

  function handleRemoveCurrentBlog() {
    dispatch(removeCurrentBlog());
  }

  function renderCreateButton() {
    if (currentBlog) {
      return (
        <Link href="/posts/edit">
          <Button variant="primary" size="sm">
            Создать
          </Button>
        </Link>
      );
    }

    return (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Блог не выбран</Tooltip>}
      >
        <div>
          <Button variant="outline-primary" size="sm" disabled={true}>
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
                      <Button variant="link" size="sm">
                        Профиль
                      </Button>
                    </Link>
                    <Button variant="link" size="sm" onClick={handleLogOut}>
                      Выйти
                    </Button>
                  </>
                ) : (
                  <>
                    {isShowedAuthButtons ? (
                      <Link href="/sign-in">
                        <Button variant="outline-primary" size="sm">
                          Войти
                        </Button>
                      </Link>
                    ) : null}
                  </>
                )}
              </Stack>
            </Navbar.Collapse>

            {currentBlog ? (
              <Navbar.Collapse>
                <Navbar.Text>
                  Текущий блог:{" "}
                  <Link href={`/blogs/${currentBlog.id}`}>
                    {currentBlog.name}
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
                <CloseButton
                  className="ms-2"
                  onClick={handleRemoveCurrentBlog}
                />
              </Navbar.Collapse>
            ) : null}
          </Stack>
        </Navbar>
      </Container>
    </Container>
  );
}
