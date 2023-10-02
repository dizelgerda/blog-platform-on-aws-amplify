import Header from "@components/Header";
import LoadStatus from "@components/LoadStatus";
import Main from "@components/Main";
import MarkdownToHTML from "@components/MarkdownToHTML";
import { getPostByID } from "@helpers/api";
import { Post } from "@helpers/types/graphql";
import { loadWrapper } from "@helpers/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

export default function PostView() {
  const router = useRouter();
  const [post, setPost] = useState<Post>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getPost = loadWrapper(async function () {
    const postID = router.query.id as string;
    const data = await getPostByID(postID);
    setPost(data as Post);
  }, setIsLoading);

  useEffect(() => {
    if (router.isReady) {
      getPost();
    }
  }, [router.isReady]);

  return (
    <>
      <Header />
      <Main>
        {isLoading ? (
          <LoadStatus />
        ) : (
          <Card>
            <Card.Body>
              <MarkdownToHTML
                title={post ? post.title : ""}
                text={post ? post.text : ""}
              />
            </Card.Body>
          </Card>
        )}
      </Main>
    </>
  );
}
