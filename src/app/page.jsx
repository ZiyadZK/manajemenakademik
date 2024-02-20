import MainLayoutPage from "@/components/mainLayout";
import { quicksand } from "@/config/fonts";
import Image from "next/image";

export default function Home() {
  return (
    <MainLayoutPage>
      <div className="p-5">
        This is Main Page
      </div>
    </MainLayoutPage>
  );
}
