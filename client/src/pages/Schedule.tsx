import Header from "./Header";
import Footer from "./Footer";
import ScheduleForm from "./Forms/ScheduleForm";

export default function AdminPage() {
  return (
    <>
      <Header />

      <main>
        <ScheduleForm />
      </main>

      <Footer />
    </>
  );
}