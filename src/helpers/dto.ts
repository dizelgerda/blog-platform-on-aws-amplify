interface User {
  attributes: {
    sub: string;
    email: string;
  };
}

export const userDTO = ({ attributes: { sub, email } }: User) => {
  return {
    id: sub,
    email,
  };
};
