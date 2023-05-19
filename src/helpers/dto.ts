// @ts-ignore
export const userDTO = ({ attributes: { sub, email } }) => {
  return {
    id: sub,
    email,
  };
};
