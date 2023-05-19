import Header from "@components/Header";
import ProtectedRoute from "@components/ProtectedRoute";
import {
  createBlog,
  deleteBlogByID,
  getBlogByID,
  getBlogsByOwner,
} from "@helpers/api";
import { useAppDispatch, useAppSelector } from "@helpers/store/hooks";
import { Blog, DeleteBlogInput } from "@helpers/types/graphql";
import { useEffect, useState } from "react";
import Main from "@components/Main";
import {
  addCurrentBlog,
  removeCurrentBlog,
} from "@helpers/store/slices/currentBlog";
import { Button, Card, Stack } from "react-bootstrap";
import LoadStatus from "@components/LoadStatus";

export default function ProfilePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const {
    currentUser: { id: userID },
    currentBlog,
  } = useAppSelector((store) => store.app);
  const dispatch = useAppDispatch();
  const { id: currentBlogID } = currentBlog as Blog;

  async function handleSelectBlog(id: string) {
    const blog = await getBlogByID(id);
    dispatch(addCurrentBlog(blog as Blog));
  }

  async function handleCreateBlog() {
    setIsLoading(true);

    await createBlog({ name: "Новый блог", owner: userID });
    await getBlogs();

    setIsLoading(false);
  }

  async function handleDeleteBlog(input: DeleteBlogInput) {
    const { id } = input;
    if (id === currentBlogID) {
      dispatch(removeCurrentBlog());
    }

    await deleteBlogByID(input);
    await getBlogs();
  }

  async function getBlogs() {
    setIsLoading(true);

    const data = await getBlogsByOwner(userID);
    console.log(data);
    setBlogs(data as Blog[]);

    setIsLoading(false);
  }

  useEffect(() => {
    if (userID) {
      getBlogs();
    }
  }, [userID]);

  return (
    <ProtectedRoute>
      <>
        <Header />
        <Main>
          {isLoading ? (
            <LoadStatus />
          ) : (
            <Stack gap={2}>
              <Button variant="outline-primary" onClick={handleCreateBlog}>
                + Блог
              </Button>
              {blogs.map(({ name, id, _version }) => {
                return (
                  <Card key={id}>
                    <Card.Body>
                      <Stack direction="horizontal" gap={2}>
                        <Card.Text className="my-auto">{name}</Card.Text>
                        <Button
                          className="ms-auto"
                          variant="link"
                          size="sm"
                          disabled={id === currentBlogID}
                          onClick={() => handleSelectBlog(id)}
                        >
                          Выбрать
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteBlog({ id, _version })}
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
        </Main>
      </>
    </ProtectedRoute>
  );
}
