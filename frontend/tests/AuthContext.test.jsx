import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AuthApi } from '../src/api/services'
import { AuthProvider, useAuth } from '../src/context/AuthContext'

vi.mock('../src/api/services', () => ({
  AuthApi: { me: vi.fn(), login: vi.fn(), logout: vi.fn() },
}))

function Probe() {
  const { user, dangTai, dangNhap } = useAuth()
  return (
    <div>
      <span data-testid="account">{dangTai ? 'loading' : user?.hoTen || 'guest'}</span>
      <button onClick={() => dangNhap('resident', 'Test12345')}>login</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    AuthApi.me.mockReset()
    AuthApi.login.mockReset()
    AuthApi.logout.mockReset()
  })
  afterEach(cleanup)

  it('loads the authenticated user again after login', async () => {
    AuthApi.me.mockRejectedValueOnce(new Error('not signed in'))
      .mockRejectedValueOnce(new Error('csrf bootstrap'))
      .mockResolvedValueOnce({ data: { hoTen: 'Fresh account', maVaiTro: 'ROLE_KHACH' } })
    AuthApi.login.mockResolvedValue({ data: { hoTen: 'Old login payload' } })
    render(<AuthProvider><Probe /></AuthProvider>)
    await screen.findByText('guest')

    fireEvent.click(screen.getByRole('button', { name: 'login' }))

    await screen.findByText('Fresh account')
    expect(AuthApi.me).toHaveBeenCalledTimes(3)
    expect(AuthApi.login).toHaveBeenCalledWith('resident', 'Test12345')
  })

  it('clears the user when the API reports an expired session', async () => {
    AuthApi.me.mockResolvedValue({ data: { hoTen: 'Resident', maVaiTro: 'ROLE_KHACH' } })
    render(<AuthProvider><Probe /></AuthProvider>)
    await screen.findByText('Resident')

    act(() => window.dispatchEvent(new Event('auth_expired')))

    await waitFor(() => expect(screen.getByTestId('account').textContent).toBe('guest'))
  })
})
