import Header from "@components/Header";
import LoadStatus from "@components/LoadStatus";
import Main from "@components/Main";
import {
  deletePostByID,
  getBlogByID,
  getPostsByBlog,
  updateBlog,
} from "@helpers/api";
import { PlainObject } from "@helpers/types";
import { Blog, DeletePostInput, Post } from "@helpers/types/graphql";
import { loadWrapper } from "@helpers/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Card, Form, Modal, Stack } from "react-bootstrap";

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [blog, setBlog] = useState<Blog>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [data, setData] = useState<PlainObject>({});
  const [postForRemove, setPostForRemove] = useState<DeletePostInput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function handleCloseModal() {
    setPostForRemove(null);
  }

  async function handleDeletePost() {
    await deletePostByID(postForRemove as DeletePostInput);
    setPostForRemove(null);
    await getPosts();
  }

  async function handleUpdateBlog() {
    const { id: blogID, _version } = blog as Blog;
    const updatedBlog = await updateBlog({ ...data, id: blogID, _version });

    setIsEditMode(false);
    setBlog(updatedBlog);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  const getPosts = loadWrapper(async function () {
    const blogID = router.query.id as string;
    const data = await getPostsByBlog(blogID);
    setPosts(data as Post[]);
  }, setIsLoading);

  const getBlog = loadWrapper(async function () {
    const blogID = router.query.id as string;
    const data = await getBlogByID(blogID);
    setBlog(data as Blog);
  }, setIsLoading);

  useEffect(() => {
    setData({});
  }, [isEditMode]);

  useEffect(() => {
    if (router.isReady) {
      getPosts();
      getBlog();
    }
  }, [router.isReady]);

  return (
    <>
      <Header />
      <Main>
        {isLoading ? (
          <LoadStatus />
        ) : (
          <Stack gap={2}>
            <Card>
              <Card.Body>
                <Stack direction="horizontal" gap={2}>
                  <Form className="w-100">
                    <Card.Title>
                      <Form.Control
                        name="name"
                        plaintext={!isEditMode}
                        readOnly={!isEditMode}
                        defaultValue={blog?.name ?? ""}
                        onChange={handleChange}
                      />
                    </Card.Title>
                    <Card.Text>
                      <Form.Control
                        name="description"
                        plaintext={!isEditMode}
                        readOnly={!isEditMode}
                        placeholder="Описание"
                        defaultValue={blog?.description ?? ""}
                        onChange={handleChange}
                      />
                    </Card.Text>
                    {isEditMode ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="mb-auto"
                        onClick={handleUpdateBlog}
                      >
                        Сохранить
                      </Button>
                    ) : null}
                  </Form>
                  <>
                    <Button
                      variant="link"
                      size="sm"
                      className="mb-auto"
                      onClick={() => setIsEditMode(!isEditMode)}
                    >
                      {isEditMode ? "Назад" : "Изменить"}
                    </Button>
                  </>
                </Stack>
              </Card.Body>
            </Card>
            {posts.map(({ title, id, _version }) => {
              return (
                <Card key={id}>
                  <Card.Body>
                    <Stack direction="horizontal" gap={2}>
                      <Card.Text className="my-auto">{title}</Card.Text>
                      <Link
                        className="ms-auto"
                        href={`/posts/edit?postID=${id}`}
                      >
                        <Button size="sm" variant={"link"}>
                          Редактировать
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setPostForRemove({ id, _version })}
                      >
                        Удалить
                      </Button>
                    </Stack>
                  </Card.Body>
                </Card>
              );
            })}
          </Stack>
        )}

        <Modal show={!!postForRemove} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Подтвердите удаление</Modal.Title>
          </Modal.Header>
          <Modal.Body>Вы уверены, что хотите удалить этот пост?</Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseModal}>
              Отмена
            </Button>
            <Button variant="danger" onClick={handleDeletePost}>
              Удалить
            </Button>
          </Modal.Footer>
        </Modal>
      </Main>
    </>
  );
}
