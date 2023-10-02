import Header from "@components/Header";
import ProtectedRoute from "@components/ProtectedRoute";
import {
  createBlog,
  deleteBlogByID,
  deletePostByID,
  getBlogByID,
  getBlogsByOwner,
  getPostsByBlog,
} from "@helpers/api";
import { useAppDispatch, useAppSelector } from "@helpers/store/hooks";
import { Blog, DeleteBlogInput, Post } from "@helpers/types/graphql";
import { useEffect, useState } from "react";
import Main from "@components/Main";
import {
  addCurrentBlog,
  removeCurrentBlog,
} from "@helpers/store/slices/currentBlog";
import { Button, Card, Modal, ProgressBar, Stack } from "react-bootstrap";
import LoadStatus from "@components/LoadStatus";
import { loadWrapper } from "@helpers/utils";
import Link from "next/link";

interface DeletionStatus {
  progress: number;
  message?: string;
}

const initialDeletionStatus: DeletionStatus = {
  progress: 0,
};

export default function ProfilePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blogForRemove, setBlogForRemove] = useState<DeleteBlogInput | null>(
    null
  );
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus>(
    initialDeletionStatus
  );
  const { currentUser, currentBlog } = useAppSelector((store) => store.app);
  const dispatch = useAppDispatch();

  function handleCloseModal() {
    setBlogForRemove(null);
  }

  const handleSelectBlog = loadWrapper(async function (id: string) {
    const blog = await getBlogByID(id);
    dispatch(addCurrentBlog(blog as Blog));
  }, setIsLoading);

  async function handleCreateBlog() {
    setIsLoading(true);

    await createBlog({ name: "Новый блог", owner: currentUser!.id });
    await getBlogs();

    setIsLoading(false);
  }

  async function handleDeleteBlog() {
    const { id: blogID } = blogForRemove as DeleteBlogInput;
    if (currentBlog && blogID === currentBlog.id) {
      dispatch(removeCurrentBlog());
    }

    setDeletionStatus({ progress: 0, message: "Удаляем посты..." });

    const posts = (await getPostsByBlog(blogID)) as Post[];

    const range = Math.ceil(100 / (posts.length + 1));

    posts.forEach(async ({ id, _version }) => {
      await deletePostByID({ id, _version });
    });
    setDeletionStatus({
      progress: posts.length ? range * posts.length : 50,
      message: "Удаляем блог...",
    });
    await deleteBlogByID(blogForRemove as DeleteBlogInput);
    await getBlogs();
    setBlogForRemove(null);
    setDeletionStatus(initialDeletionStatus);
  }

  async function getBlogs() {
    setIsLoading(true);

    const data = await getBlogsByOwner(currentUser!.id);
    console.log(data);
    setBlogs(data as Blog[]);

    setIsLoading(false);
  }

  useEffect(() => {
    if (currentUser) {
      getBlogs();
    }
  }, [currentUser]);

  useEffect(() => {
    console.log(deletionStatus);
  }, [deletionStatus]);

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
                        <Link href={`/blogs/${id}`}>
                          <Card.Text className="my-auto">{name}</Card.Text>
                        </Link>
                        <Button
                          className="ms-auto"
                          variant="link"
                          size="sm"
                          disabled={currentBlog ? id === currentBlog.id : false}
                          onClick={() => handleSelectBlog(id)}
                        >
                          Выбрать
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setBlogForRemove({ id, _version })}
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

          <Modal show={!!blogForRemove} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Подтвердите удаление</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Stack gap={2}>
                Вы уверены, что хотите удалить этот блог? Также будут удалены
                все посты этого блога.
                <ProgressBar
                  animated
                  variant="danger"
                  now={deletionStatus.progress}
                />
                {deletionStatus.message ?? ""}
              </Stack>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleCloseModal}>
                Отмена
              </Button>
              <Button variant="danger" onClick={handleDeleteBlog}>
                Удалить
              </Button>
            </Modal.Footer>
          </Modal>
        </Main>
      </>
    </ProtectedRoute>
  );
}
