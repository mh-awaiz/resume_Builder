import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-foreground text-background">
      <h1 className="text-8xl font-bold text-primary">404</h1>

      <p className="text-2xl font-normal mt-4 text-center">
        <span> Page Not Found</span>
        <br />
        Go back to
        <Link href="/" className="text-primary font-bold">
          <span> </span> Home
        </Link>
      </p>
    </div>
  );
}
