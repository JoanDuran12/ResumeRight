import Header from "../app/components/Header";
import Main from "../app/components/Main";
import Features from "../app/components/Features";
import Component from "../app/components/Component";
import Footer from "../app/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Main />
      </main>
      <Features />
      <Component />
      <Footer />
    </>
  );
}
