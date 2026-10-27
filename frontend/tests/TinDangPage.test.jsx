import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BatDongSanApi, PhongApi, TinDangApi } from '../src/api/services'
import TinDangPage from '../src/pages/admin/TinDangPage'

vi.mock('../src/api/services', () => ({
  TinDangApi: { danhSach: vi.fn(), xuatBan: vi.fn(), an: vi.fn(), themAnh: vi.fn() },
  BatDongSanApi: { khuVuc: vi.fn(), danhSach: vi.fn() },
  PhongApi: { danhSach: vi.fn(), chiTiet: vi.fn() },
}))
const toast = { loi: vi.fn(), thanhCong: vi.fn() }
vi.mock('../src/context/ToastContext', () => ({ useToast: () => toast }))

const draft = {
  id: 'can-thu', dbId: 7, ma: 'T-01', tieuDe: 'Căn thử', khuVuc: 'q1', loai: 'Căn hộ', phongNgu: 1,
  phongTam: 1, dienTich: 40, tang: 3, gia: 12000000, datCoc: 24000000, trangThai: 'trong', noiBat: false,
  chiTietAnh: [], tienNghi: [], moTa: 'Mô tả', trangThaiTin: 'nhap', batDongSanId: 3, phongId: null,
}
const page = (rows) => ({ data: { noiDung: rows, trang: 0, tongSoTrang: 1, tongSoBanGhi: rows.length } })

describe('TinDangPage', () => {
  beforeEach(() => {
    Object.values(TinDangApi).forEach((fn) => fn.mockReset())
    toast.loi.mockReset()
    toast.thanhCong.mockReset()
    BatDongSanApi.khuVuc.mockResolvedValue({ data: [{ id: 'q1', ten: 'Quận 1', soTin: 0, hienThi: true }] })
    BatDongSanApi.danhSach.mockResolvedValue({ data: [{ id: 3, khuVucSlug: 'q1', ten: 'Tòa A', diaChi: '1 Lê Lợi' }] })
    PhongApi.danhSach.mockResolvedValue({ data: { noiDung: [] } })
  })
  afterEach(cleanup)

  it('publishes a draft, refreshes the list and notifies the public catalog', async () => {
    TinDangApi.danhSach.mockResolvedValueOnce(page([draft]))
      .mockResolvedValueOnce(page([{ ...draft, trangThaiTin: 'xuat_ban' }]))
    TinDangApi.xuatBan.mockResolvedValue({ data: { ...draft, trangThaiTin: 'xuat_ban' } })
    const catalogRefresh = vi.fn()
    window.addEventListener('catalog_updated', catalogRefresh)
    try {
      render(<MemoryRouter><TinDangPage /></MemoryRouter>)
      const row = (await screen.findByText('Căn thử')).closest('tr')
      expect(within(row).getByText('Tòa A')).toBeTruthy()

      fireEvent.click(within(row).getByText('Xuất bản'))

      await waitFor(() => expect(TinDangApi.xuatBan).toHaveBeenCalledWith(7))
      await waitFor(() => expect(within(row).getByText('Đang xuất bản')).toBeTruthy())
      expect(within(row).getByText('Ẩn')).toBeTruthy()
      expect(catalogRefresh).toHaveBeenCalledOnce()
    } finally {
      window.removeEventListener('catalog_updated', catalogRefresh)
    }
  })

  it('shows the server reason when publishing is refused', async () => {
    TinDangApi.danhSach.mockResolvedValue(page([draft]))
    TinDangApi.xuatBan.mockRejectedValue({ response: { data: { thongBao: 'Cần tải ít nhất một ảnh trước khi xuất bản' } } })
    render(<MemoryRouter><TinDangPage /></MemoryRouter>)
    fireEvent.click(within((await screen.findByText('Căn thử')).closest('tr')).getByText('Xuất bản'))
    await waitFor(() => expect(toast.loi).toHaveBeenCalledWith('Cần tải ít nhất một ảnh trước khi xuất bản'))
    expect(toast.thanhCong).not.toHaveBeenCalled()
  })

  it('rejects non-image files and uploads a valid image', async () => {
    TinDangApi.danhSach.mockResolvedValue(page([draft]))
    const uploaded = { ...draft, chiTietAnh: [{ id: 11, url: '/api/tin-dang/7/anh/11', thuTu: 0, altText: 'Phòng khách' }] }
    TinDangApi.themAnh.mockResolvedValue({ data: uploaded })
    URL.createObjectURL = vi.fn(() => 'blob:preview')
    URL.revokeObjectURL = vi.fn()
    render(<MemoryRouter><TinDangPage /></MemoryRouter>)
    fireEvent.click(within((await screen.findByText('Căn thử')).closest('tr')).getByText('Ảnh'))
    const input = document.querySelector('input[type="file"]')
    const submit = screen.getByText('Tải lên')

    fireEvent.change(input, { target: { files: [new File(['%PDF'], 'hop-dong.pdf', { type: 'application/pdf' })] } })
    expect(screen.getByRole('alert').textContent).toContain('JPG, PNG hoặc WEBP')
    expect(submit.disabled).toBe(true)

    const png = new File(['png'], 'phong.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [png] } })
    expect(screen.queryByRole('alert')).toBeNull()
    fireEvent.click(submit)

    await waitFor(() => expect(TinDangApi.themAnh).toHaveBeenCalledWith(7, png, ''))
    expect(await screen.findByText(/Ảnh bìa/)).toBeTruthy()
  })
})
