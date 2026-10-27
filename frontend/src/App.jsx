import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ShortlistProvider } from './context/ShortlistContext'
import { GuestOnly, RequireAdmin, RequireAuth, RequireKhach, RequireStaff } from './components/guards'
import Layout from './components/Layout'
import SiteLayout from './components/site/SiteLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PhongPage from './pages/PhongPage'
import LoaiPhongPage from './pages/LoaiPhongPage'
import KhachThuePage from './pages/KhachThuePage'
import KhachThueChiTiet from './pages/KhachThueChiTiet'
import HopDongPage from './pages/HopDongPage'
import HopDongChiTiet from './pages/HopDongChiTiet'
import DichVuPage from './pages/DichVuPage'
import TaiKhoanPage from './pages/TaiKhoanPage'
import ThongBaoPage from './pages/ThongBaoPage'
import HopDongCuaToi from './pages/HopDongCuaToi'
import DoiMatKhau from './pages/DoiMatKhau'
import CuDanDashboard from './pages/portal/CuDanDashboard'
import HoSoPage from './pages/portal/HoSoPage'
import ConciergePage from './pages/portal/ConciergePage'
import DichVuCuDanPage from './pages/portal/DichVuCuDanPage'
import YeuCauPage from './pages/YeuCauPage'
import NotFoundPage from './pages/NotFoundPage'
import HomePage from './pages/site/HomePage'
import ListingsPage from './pages/site/ListingsPage'
import PropertyDetailPage from './pages/site/PropertyDetailPage'
import AboutPage from './pages/site/AboutPage'
import ContactPage from './pages/site/ContactPage'
import InsightsPage from './pages/site/InsightsPage'
import InsightDetailPage from './pages/site/InsightDetailPage'
import ServicesPage from './pages/site/ServicesPage'
import OwnersPage from './pages/site/OwnersPage'
import DistrictsPage from './pages/site/DistrictsPage'
import DistrictDetailPage from './pages/site/DistrictDetailPage'
import FaqPage from './pages/site/FaqPage'
import PolicyPage from './pages/site/PolicyPage'
import ViewingPage from './pages/site/ViewingPage'
import ShortlistPage from './pages/site/ShortlistPage'
import ComparePage from './pages/site/ComparePage'
import BudgetPage from './pages/site/BudgetPage'
import AdvisorsPage from './pages/site/AdvisorsPage'
import CareersPage from './pages/site/CareersPage'
import PressPage from './pages/site/PressPage'
import ProcessPage from './pages/site/ProcessPage'
import ServiceDetailPage from './pages/site/ServiceDetailPage'
import MapPage from './pages/site/MapPage'
import AdvisorDetailPage from './pages/site/AdvisorDetailPage'
import CareerDetailPage from './pages/site/CareerDetailPage'
import TestimonialsPage from './pages/site/TestimonialsPage'
import BriefPage from './pages/site/BriefPage'
import LivingGuidePage from './pages/site/LivingGuidePage'
import ViewingConfirmPage from './pages/site/ViewingConfirmPage'
import PhongChiTiet from './pages/PhongChiTiet'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ShortlistProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/bat-dong-san" element={<ListingsPage />} />
              <Route path="/bat-dong-san/:id" element={<PropertyDetailPage />} />
              <Route path="/ban-do" element={<MapPage />} />
              <Route path="/brief" element={<BriefPage />} />
              <Route path="/loi-khach" element={<TestimonialsPage />} />
              <Route path="/huong-dan" element={<LivingGuidePage />} />
              <Route path="/quan-tam" element={<ShortlistPage />} />
              <Route path="/so-sanh" element={<ComparePage />} />
              <Route path="/ngan-sach" element={<BudgetPage />} />
              <Route path="/thi-truong" element={<InsightsPage />} />
              <Route path="/thi-truong/:id" element={<InsightDetailPage />} />
              <Route path="/dich-vu" element={<ServicesPage />} />
              <Route path="/dich-vu/:id" element={<ServiceDetailPage />} />
              <Route path="/chu-nha" element={<OwnersPage />} />
              <Route path="/khu-vuc" element={<DistrictsPage />} />
              <Route path="/khu-vuc/:id" element={<DistrictDetailPage />} />
              <Route path="/dat-lich/xac-nhan" element={<ViewingConfirmPage />} />
              <Route path="/dat-lich" element={<ViewingPage />} />
              <Route path="/quy-trinh" element={<ProcessPage />} />
              <Route path="/doi-ngu/:id" element={<AdvisorDetailPage />} />
              <Route path="/doi-ngu" element={<AdvisorsPage />} />
              <Route path="/tuyen-dung/:id" element={<CareerDetailPage />} />
              <Route path="/tuyen-dung" element={<CareersPage />} />
              <Route path="/bao-chi" element={<PressPage />} />
              <Route path="/hoi-dap" element={<FaqPage />} />
              <Route path="/chinh-sach" element={<PolicyPage />} />
              <Route path="/ve-chung-toi" element={<AboutPage />} />
              <Route path="/lien-he" element={<ContactPage />} />
            </Route>
            <Route element={<GuestOnly />}>
              <Route path="/dang-nhap" element={<Login />} />
            </Route>
            <Route path="/quan-ly" element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route element={<RequireStaff />}>
                  <Route index element={<Dashboard />} />
                  <Route path="phong" element={<PhongPage />} />
                  <Route path="phong/:id" element={<PhongChiTiet />} />
                  <Route path="loai-phong" element={<LoaiPhongPage />} />
                  <Route path="khach-thue" element={<KhachThuePage />} />
                  <Route path="khach-thue/:id" element={<KhachThueChiTiet />} />
                  <Route path="hop-dong" element={<HopDongPage />} />
                  <Route path="hop-dong/:id" element={<HopDongChiTiet />} />
                  <Route path="dich-vu" element={<DichVuPage />} />
                  <Route path="yeu-cau" element={<YeuCauPage />} />
                </Route>
                <Route element={<RequireAdmin />}>
                  <Route path="tai-khoan" element={<TaiKhoanPage />} />
                </Route>
                <Route element={<RequireKhach />}>
                  <Route path="cong-cu-dan" element={<CuDanDashboard />} />
                  <Route path="hop-dong-cua-toi" element={<HopDongCuaToi />} />
                  <Route path="dich-vu-cu-dan" element={<DichVuCuDanPage />} />
                  <Route path="ho-tro" element={<ConciergePage />} />
                </Route>
                <Route path="thong-bao" element={<ThongBaoPage />} />
                <Route path="doi-mat-khau" element={<DoiMatKhau />} />
                <Route path="ho-so" element={<HoSoPage />} />
                <Route path="*" element={<NotFoundPage embedded />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        </ShortlistProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
