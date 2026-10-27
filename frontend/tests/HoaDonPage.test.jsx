import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HoaDonApi, HopDongApi } from '../src/api/services'
import HoaDonPage from '../src/pages/admin/HoaDonPage'

vi.mock('../src/api/services', () => ({
  HoaDonApi: { danhSach: vi.fn(), thongKe: vi.fn(), goiY: vi.fn(), lap: vi.fn() },
  HopDongApi: { danhSach: vi.fn() },
}))
const toast = { loi: vi.fn(), thanhCong: vi.fn() }
vi.mock('../src/context/ToastContext', () => ({ useToast: () => toast }))

const goiY = {
  hopDongId: 5, maPhong: 'P101', ky: '2026-10', kyDau: true, dong: [
    { dichVuId: null, noiDung: 'Tiền phòng P101', donVi: 'tháng', soLuong: 1, donGia: 5000000, thanhTien: 5000000, theoChiSo: false },
    { dichVuId: 1, noiDung: 'Điện', donVi: 'kWh', chiSoCu: 0, soLuong: 0, donGia: 3500, thanhTien: 0, theoChiSo: true },
  ],
}

describe('HoaDonPage', () => {
  beforeEach(() => {
    Object.values(HoaDonApi).forEach((fn) => fn.mockReset())
    toast.loi.mockReset()
    HoaDonApi.danhSach.mockResolvedValue({ data: { noiDung: [], trang: 0, tongSoTrang: 0 } })
    HoaDonApi.thongKe.mockResolvedValue({ data: null })
    HopDongApi.danhSach.mockResolvedValue({ data: { noiDung: [{ id: 5, maPhong: 'P101', maHopDong: 'HD-5', khachThue: { hoTen: 'An' } }] } })
    HoaDonApi.goiY.mockResolvedValue({ data: goiY })
    HoaDonApi.lap.mockResolvedValue({ data: { maHoaDon: 'HD202610-P101-5' } })
  })
  afterEach(cleanup)

  it('previews the total from meter readings and submits the first-period reading', async () => {
    render(<MemoryRouter><HoaDonPage /></MemoryRouter>)
    fireEvent.click(await screen.findByText('Lập hóa đơn'))
    fireEvent.change(await screen.findByDisplayValue('Chọn hợp đồng'), { target: { value: '5' } })
    await screen.findByText('Tiền phòng P101')

    const [cu, moi] = document.querySelectorAll('.modal input[type="number"]')
    fireEvent.change(cu, { target: { value: '100' } })
    fireEvent.change(moi, { target: { value: '150' } })
    expect(screen.getByText(/5\.175\.000/)).toBeTruthy()

    fireEvent.submit(cu.closest('form'))
    await waitFor(() => expect(HoaDonApi.lap).toHaveBeenCalledWith({
      hopDongId: 5, ky: expect.stringMatching(/^\d{4}-\d{2}$/), ghiChu: '', chiSo: [{ dichVuId: 1, chiSoCu: 100, chiSoMoi: 150 }],
    }))
    expect(toast.thanhCong).toHaveBeenCalledWith('Đã lập hóa đơn HD202610-P101-5')
  })
})
