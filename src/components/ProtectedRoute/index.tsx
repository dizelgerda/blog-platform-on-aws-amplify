import { useAppSelector } from "@helpers/store/hooks";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAppSelector((state) => state.app);

  if (isLoggedIn) {
    return children;
  }

  return (
    <>
      <p>Доступ запрещён</p>
    </>
  );
}
