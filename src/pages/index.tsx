import Header from "@components/Header";
import LoadStatus from "@components/LoadStatus";
import Main from "@components/Main";
import { getLastPosts } from "@helpers/api";
import { Post } from "@helpers/types/graphql";
import { loadWrapper } from "@helpers/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, Stack } from "react-bootstrap";

export default function MainPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getPosts = loadWrapper(async function () {
    const data = await getLastPosts();
    setPosts(data as Post[]);
  }, setIsLoading);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Header />
      <Main>
        {isLoading ? (
          <LoadStatus />
        ) : (
          <Stack gap={2}>
            {posts.map(({ title, id, blog }) => {
              return (
                <Card key={id}>
                  <Card.Body>
                    <Stack direction="horizontal" gap={2}>
                      <Link href={`/posts/${id}`}>
                        <Card.Text className="my-auto">{title}</Card.Text>
                      </Link>

                      <Link className="ms-auto" href={`/blogs/${blog}`}>
                        <Button size="sm" variant={"link"}>
                          В блог →
                        </Button>
                      </Link>
                    </Stack>
                  </Card.Body>
                </Card>
              );
            })}
          </Stack>
        )}
      </Main>
    </>
  );
}
