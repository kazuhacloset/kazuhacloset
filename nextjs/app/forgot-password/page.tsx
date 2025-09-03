import React from 'react'
import { Toaster } from 'react-hot-toast'
import ForgotPasswordPage from '@/components/ForgotPassword'

export default function Page() {
  return (
    <div>
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          style: { transition: 'all 0.5s ease-in-out' },
        }}
      />
      <ForgotPasswordPage />
    </div>
  )
}
