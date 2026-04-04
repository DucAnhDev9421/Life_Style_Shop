import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import BlogPage from "./pages/BlogPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { ConfigProvider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";

function App() {
  const { t, i18n } = useTranslation();
  const user = localStorage.getItem("user");

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0E5E76", // Teal Theme
          colorBgBase: "#ffffff",
          fontFamily: "Inter, -apple-system, sans-serif",
          borderRadius: 8,
        },
      }}
    >
      <div className="min-h-screen bg-[#f8f9fa] text-[#1d1d1f] font-sans pb-10">
        <Toaster position="top-center" />
        {/* Header matching the design */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 h-20">
            <div className="flex items-center gap-12 text-[#0E5E76]">
              <Link to="/" className="flex items-center">
                <h1 className="text-xl font-extrabold uppercase leading-tight w-24">
                  LIFESTYLE SHOPE
                </h1>
              </Link>

              <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-gray-600">
                <Link
                  className="hover:text-[#0E5E76] transition-colors"
                  to="/search"
                >
                  Shop All
                </Link>
                <Link
                  className="hover:text-[#0E5E76] transition-colors"
                  to="/equipment"
                >
                  Equipment
                </Link>
                <Link
                  className="hover:text-[#0E5E76] transition-colors"
                  to="/apparel"
                >
                  Apparel
                </Link>
                <Link
                  className="hover:text-[#0E5E76] transition-colors"
                  to="/wellness"
                >
                  Wellness
                </Link>
                <Link
                  className="hover:text-[#0E5E76] transition-colors"
                  to="/blog"
                >
                  Journal
                </Link>
              </div>
            </div>

            <div className="flex gap-6 items-center justify-end text-gray-600">
              <Link
                to={user ? "/account" : "/login"}
                className="transition-colors hover:text-[#0E5E76]"
              >
                <UserOutlined className="text-lg" />
              </Link>

              <Link to="/cart">
                <button className="bg-[#0E5E76] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#0b4d62] transition-colors shadow-sm">
                  Cart
                </button>
              </Link>
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </ConfigProvider>
  );
}

export default App;
