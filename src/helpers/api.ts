import { Auth } from "aws-amplify";
import { API, GraphQLQuery, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { addCurrentUser, removeCurrentUser } from "./store/slices/currentUser";
import { store } from "./store";
import { changeStatus } from "./store/slices/isLoggedIn";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import { userDTO } from "./dto";
import {
  Blog,
  CreateBlogInput,
  CreateBlogMutation,
  CreatePostInput,
  CreatePostMutation,
  DeleteBlogInput,
  DeleteBlogMutation,
  DeletePostInput,
  DeletePostMutation,
  GetBlogQuery,
  GetPostQuery,
  ListBlogsQuery,
  ListBlogsQueryVariables,
  ListPostsQuery,
  Post,
  UpdateBlogInput,
  UpdateBlogMutation,
  UpdatePostInput,
  UpdatePostMutation,
} from "./types/graphql";
import { removeCurrentBlog } from "./store/slices/currentBlog";

function filterByDeleted(data: { _deleted?: boolean | null }[]) {
  return data.filter(({ _deleted }) => {
    if (!_deleted) return true;
  });
}

// AUTH

export async function signUp(username: string, password: string) {
  try {
    const { user } = await Auth.signUp({
      username,
      password,
    });
  } catch (error) {
    console.error("error signing up:", error);
  }
}

export async function confirmSignUp(username: string, code: string) {
  try {
    await Auth.confirmSignUp(username, code);
  } catch (error) {
    console.error("error confirming sign up", error);
  }
}

export async function signIn(username: string, password: string) {
  try {
    const user = await Auth.signIn(username, password);

    store.dispatch(changeStatus(true));
    store.dispatch(addCurrentUser(userDTO(user)));
  } catch (error) {
    console.error("error signing in", error);
  }
}

export async function signOut() {
  try {
    await Auth.signOut();

    store.dispatch(changeStatus(false));
    store.dispatch(removeCurrentUser());
    store.dispatch(removeCurrentBlog());
  } catch (error) {
    console.log("error signing out: ", error);
  }
}

export async function checkAuth() {
  try {
    const user = await Auth.currentAuthenticatedUser();

    store.dispatch(changeStatus(true));
    store.dispatch(addCurrentUser(userDTO(user)));
  } catch (error) {
    console.error(error);
  }
}

// POST

export async function createPost(input: CreatePostInput) {
  try {
    const { data } = await API.graphql<GraphQLQuery<CreatePostMutation>>({
      query: mutations.createPost,
      variables: { input },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });

    return data?.createPost;
  } catch (error) {
    console.error(error);
  }
}

export async function updatePost(input: UpdatePostInput) {
  try {
    const { data } = await API.graphql<GraphQLQuery<UpdatePostMutation>>({
      query: mutations.updatePost,
      variables: {
        input,
      },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });

    return data?.updatePost;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostByID(id: string) {
  try {
    const { data } = await API.graphql<GraphQLQuery<GetPostQuery>>({
      query: queries.getPost,
      variables: { id },
    });

    return data?.getPost;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostsByBlog(id: string) {
  try {
    const { data } = await API.graphql<GraphQLQuery<ListPostsQuery>>({
      query: queries.listPosts,
      variables: {
        filter: {
          blog: {
            eq: id,
          },
        },
      },
    });

    return filterByDeleted(data?.listPosts?.items as Post[]);
  } catch (error) {
    console.error(error);
  }
}

export async function deletePostByID(input: DeletePostInput) {
  try {
    await API.graphql<GraphQLQuery<DeletePostMutation>>({
      query: mutations.deletePost,
      variables: { input },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  } catch (error) {
    console.error(error);
  }
}

// BLOG

export async function createBlog(data: CreateBlogInput) {
  try {
    await API.graphql<GraphQLQuery<CreateBlogMutation>>({
      query: mutations.createBlog,
      variables: { input: data },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function updateBlog(input: UpdateBlogInput) {
  try {
    const { data } = await API.graphql<GraphQLQuery<UpdateBlogMutation>>({
      query: mutations.updateBlog,
      variables: { input },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });

    return data?.updateBlog as Blog;
  } catch (error) {
    console.error(error);
  }
}

export async function getBlogByID(id: string) {
  try {
    const { data } = await API.graphql<GraphQLQuery<GetBlogQuery>>({
      query: queries.getBlog,
      variables: { id },
    });

    return data!.getBlog;
  } catch (error) {
    console.error(error);
  }
}

export async function getBlogsByOwner(id: string) {
  try {
    const { data } = await API.graphql<GraphQLQuery<ListBlogsQuery>>({
      query: queries.listBlogs,
      variables: {
        filter: {
          owner: {
            eq: id,
          },
        },
      },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });

    return filterByDeleted(data!.listBlogs!.items as Blog[]);
  } catch (error) {
    console.error(error);
  }
}

export async function deleteBlogByID(input: DeleteBlogInput) {
  try {
    await API.graphql<GraphQLQuery<DeleteBlogMutation>>({
      query: mutations.deleteBlog,
      variables: { input },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  } catch (error) {
    console.error(error);
  }
}
