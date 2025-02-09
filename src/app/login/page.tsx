import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function LoginPage() {
  return (
    <>
      <main className="h-dvh flex flex-col items-center gap-6 text-4xl p-4">
        <h1>Next Notes</h1>
        <div>
          <Button asChild>
            <LoginLink>Sign in</LoginLink>
          </Button>
        </div>
        <div>
          <Button asChild>
            <RegisterLink>Register</RegisterLink>
          </Button>
        </div>
      </main>
    </>
  );
}
