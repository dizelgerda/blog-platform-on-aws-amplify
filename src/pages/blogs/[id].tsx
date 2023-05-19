import Header from "@components/Header";
import Main from "@components/Main";
import {
  deletePostByID,
  getBlogByID,
  getPostsByBlog,
  updateBlog,
} from "@helpers/api";
import { PlainObject } from "@helpers/types";
import { Blog, DeletePostInput, Post } from "@helpers/types/graphql";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Card, Form, Stack } from "react-bootstrap";

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [blog, setBlog] = useState<Blog>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [data, setData] = useState<PlainObject>({});

  async function handleDeletePost(data: DeletePostInput) {
    await deletePostByID(data);
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

  async function getPosts() {
    const blogID = router.query.id as string;
    const data = await getPostsByBlog(blogID);
    setPosts(data as Post[]);
  }

  async function getBlog() {
    const blogID = router.query.id as string;
    const data = await getBlogByID(blogID);
    setBlog(data as Blog);
  }

  useEffect(() => {
    setData({});
  }, [isEditMode]);

  useEffect(() => {
    getPosts();
    getBlog();
  }, []);

  return (
    <>
      <Header />
      <Main>
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
                    <Link className="ms-auto" href={`/posts/edit?postID=${id}`}>
                      <Button size="sm" variant={"link"}>
                        Редактировать
                      </Button>
                    </Link>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeletePost({ id, _version })}
                    >
                      Удалить
                    </Button>
                  </Stack>
                </Card.Body>
              </Card>
            );
          })}
        </Stack>
      </Main>
    </>
  );
}
