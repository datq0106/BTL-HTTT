import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AuthApi } from '../api/services'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [dangTai, setDangTai] = useState(true)

  useEffect(() => {
    let huy = false
    AuthApi.me()
      .then(({ data }) => {
        if (!huy) setUser(data)
      })
      .catch(() => {
        if (!huy) setUser(null)
      })
      .finally(() => {
        if (!huy) setDangTai(false)
      })
    return () => {
      huy = true
    }
  }, [])

  const dangNhap = useCallback(async (tenDangNhap, matKhau) => {
    await AuthApi.me().catch(() => {})
    const { data } = await AuthApi.login(tenDangNhap, matKhau)
    setUser(data)
    return data
  }, [])

  const dangXuat = useCallback(async () => {
    try {
      await AuthApi.logout()
    } catch {
      /* phiên có thể đã hết */
    }
    setUser(null)
  }, [])

  const laAdmin = user?.maVaiTro === 'ROLE_ADMIN'
  const laNhanVien = laAdmin || user?.maVaiTro === 'ROLE_QUAN_LY'
  const laKhach = user?.maVaiTro === 'ROLE_KHACH'

  const value = useMemo(
    () => ({
      user,
      dangTai,
      dangNhap,
      dangXuat,
      laAdmin,
      laNhanVien,
      laKhach,
      duongDanSauDangNhap: laNhanVien ? '/quan-ly' : '/quan-ly/cong-cu-dan',
    }),
    [user, dangTai, dangNhap, dangXuat, laAdmin, laNhanVien, laKhach],
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth cần AuthProvider')
  return ctx
}
