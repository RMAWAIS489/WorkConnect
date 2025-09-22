import Navbar from "@/app/components/candidate/navbar";

export default function CandiadateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar/>
      {children}
    </>
  );
}
