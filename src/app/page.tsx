import Header from "../app/components/Header";
import Main from "../app/components/Main";
import Features from "../app/components/Features";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Main />
      </main>
      <Features />
    </>
  );
}
