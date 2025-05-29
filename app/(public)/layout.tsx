import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WalletProvider } from "@/components/wallet/WalletContext";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <Header />
      {children}
      <Footer />
    </WalletProvider>
  );
}
