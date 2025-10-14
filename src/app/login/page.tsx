import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="w-full max-w-sm">
        <Card className="w-full bg-transparent">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-yellow-400">Log in</CardTitle>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-4">
              <div>
                <Label htmlFor="username" className="text-yellow-300">Username:</Label>
                <Input id="username" name="username" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="password" className="text-yellow-300">Password:</Label>
                <Input id="password" name="password" type="password" className="mt-2" />
              </div>

              <div className="text-right text-sm text-yellow-300">
                <Link href="#">forget password?</Link>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Button className="w-full">Log in</Button>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">Sign up</Button>
                </Link>
              </div>
            </form>
          </CardContent>

          <CardFooter />
        </Card>
      </main>
    </div>
  );
}
