"use client"
import { useAuthenticator, Authenticator} from "@aws-amplify/ui-react";
import { redirect, useSearchParams} from "next/navigation";
import { Suspense } from "react";

const LoginElement = () => {
  const searchParams = useSearchParams()
  const redirect_url = searchParams.get('return')
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  if (authStatus === "authenticated") {
    // This is so you can return the user to the page they would have seen
    // if they didn't need to sign in without them having to re-click it
    if (redirect_url) {
      // force it to a local url cuz it would be catastrophically bad if 
      // someone else could make arbitrary redirects after login
      redirect(`/${redirect_url}`);
    } else {
      redirect("/");
    }
  }
  return (
    <Authenticator signUpAttributes={['email']} />
  )
}

export default function Login() {
  return (
    <Suspense fallback={"loading"}>
      <LoginElement/>
    </Suspense>
  );
}
