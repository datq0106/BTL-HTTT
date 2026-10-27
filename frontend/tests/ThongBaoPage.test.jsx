import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThongBaoApi } from '../src/api/services'
import ThongBaoPage from '../src/pages/shared/ThongBaoPage'

vi.mock('../src/api/services', () => ({
  ThongBaoApi: {
    danhSach: vi.fn(),
    daDoc: vi.fn(),
    daDocTatCa: vi.fn(),
  },
}))
vi.mock('../src/context/AuthContext', () => ({ useAuth: () => ({ laKhach: true }) }))
vi.mock('../src/context/ToastContext', () => ({
  useToast: () => ({ loi: vi.fn(), thanhCong: vi.fn() }),
}))

const unread = {
  id: 1, tieuDe: 'Notice under test', noiDung: 'Content', loai: 'chung',
  nhanLoai: 'General', createdAt: '2026-10-27T09:00:00', daDoc: null,
}
const page = (item) => ({ data: { noiDung: [item], trang: 0, tongSoTrang: 1 } })

describe('ThongBaoPage', () => {
  beforeEach(() => {
    ThongBaoApi.danhSach.mockReset()
    ThongBaoApi.daDoc.mockReset()
    ThongBaoApi.daDocTatCa.mockReset()
  })
  afterEach(cleanup)

  it('shows unread state and creation time, then refreshes the badge after marking read', async () => {
    ThongBaoApi.danhSach.mockResolvedValueOnce(page(unread))
      .mockResolvedValueOnce(page({ ...unread, daDoc: '2026-10-27T10:00:00' }))
    ThongBaoApi.daDoc.mockResolvedValue({ status: 204 })
    const badgeRefresh = vi.fn()
    window.addEventListener('thongbao_updated', badgeRefresh)
    try {
      render(<ThongBaoPage />)
      const title = await screen.findByText('Notice under test')
      expect(title.closest('.notice').classList.contains('unread')).toBe(true)
      expect(screen.getByText(/27\/10\/2026/)).toBeTruthy()

      fireEvent.click(title.closest('.notice'))

      await waitFor(() => expect(ThongBaoApi.daDoc).toHaveBeenCalledWith(1))
      await waitFor(() => expect(title.closest('.notice').classList.contains('unread')).toBe(false))
      expect(badgeRefresh).toHaveBeenCalledOnce()
    } finally {
      window.removeEventListener('thongbao_updated', badgeRefresh)
    }
  })
})
