import { Outlet } from '@tanstack/react-router'
import Navbar from './navbar'
import Footer from './footer'
import PageLoader from "@/components/page-loader.tsx";
import WhatsAppButton from "@/components/whatsapp-button";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fffe]">
      <Navbar />
      <main className="flex-1">
        <PageLoader />
        <Outlet /> {/* Child routes render here */}
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}

export default MainLayout
