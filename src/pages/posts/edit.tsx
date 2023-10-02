import Header from "@components/Header";
import { createPost, getPostByID, updatePost } from "@helpers/api";
import { useAppSelector } from "@helpers/store/hooks";
import { PlainObject } from "@helpers/types";
import { Blog, CreatePostInput, Post } from "@helpers/types/graphql";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Main from "@components/Main";
import { Button, Card, Form, InputGroup, Tab, Tabs } from "react-bootstrap";
import MarkdownToHTML from "@components/MarkdownToHTML";
import { User } from "@helpers/types/user";

export default function PostEditPage() {
  const [data, setData] = useState<PlainObject>({});
  const [currentPost, setCurrentPost] = useState<Post>();
  const { currentUser: owner, currentBlog } = useAppSelector(
    (store) => store.app
  );
  const router = useRouter();

  useEffect(() => {
    const id = router.query.postID as string;
    if (id) {
      getPostByID(id).then((post) => {
        const { title, text } = post as Post;
        setCurrentPost(post as Post);
        setData({ title, text });

        router.push(`/posts/edit?postID=${id}`, undefined, {
          shallow: true,
        });
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!(currentBlog as Blog).id) {
      router.push("/profile");
    }
  }, [currentBlog]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (currentPost) {
      console.log(data);
      console.log(
        await updatePost({
          ...data,
          id: currentPost.id,
          _version: currentPost._version,
        })
      );
      console.log("Сохранено");
    } else {
      const blog = (currentBlog as Blog).id;
      const post = await createPost({
        ...data,
        owner: (owner as User).id,
        blog,
      } as CreatePostInput);

      setCurrentPost(post as Post);
      router.push(`/posts/edit?postID=${post!.id}`, undefined, {
        shallow: true,
      });
    }
  }

  return (
    <>
      <Header />
      <Main>
        <Card>
          <Card.Body>
            <Tabs>
              <Tab eventKey="editor" title="Редактор">
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="mt-4 mb-4">
                    <InputGroup.Text>#</InputGroup.Text>
                    <Form.Control
                      name="title"
                      placeholder="Заголовок"
                      value={data.title ?? ""}
                      onChange={handleChange}
                    />
                  </InputGroup>

                  <Form.Group className="mb-4">
                    <Form.Label>Текст</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={15}
                      name="text"
                      placeholder="Основной текст"
                      value={data.text ?? ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Опубликовать
                  </Button>
                </Form>
              </Tab>
              <Tab eventKey="preview" title="Предпросмотр">
                <MarkdownToHTML
                  className="mt-4"
                  title={data.title ?? ""}
                  text={data.text ?? ""}
                />
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Main>
    </>
  );
}
