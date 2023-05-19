import Header from "@components/Header";
import MarkdownToHTML from "@components/MarkdownToHTML";
import { getPostByID } from "@helpers/api";
import { Post } from "@helpers/types/graphql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PostView() {
  const router = useRouter();
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    const postID = router.query.id as string;
    if (postID) {
      getPostByID(postID).then((data) => setPost(data as Post));
    }
  }, [router.isReady]);

  return (
    <>
      <Header />
      <MarkdownToHTML
        title={post ? post.title : ""}
        text={post ? post.text : ""}
      />
    </>
  );
}
