import React, { createContext, useContext } from 'react'
import {
  Toaster,
  useToastController,
  ToastIntent,
  Toast,
  ToastTitle,
  ToastBody,
} from '@fluentui/react-components'

// Define the context type
interface MessageContextType {
  showMessage: (
    text: string,
    subtext: string,
    intent?: ToastIntent,
    duration?: number,
  ) => void
}

// Create the context
const MessageContext = createContext<MessageContextType | undefined>(undefined)

// Message Provider Component
export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { dispatchToast } = useToastController() // Fluent UI Toast controller

  const showMessage = (
    text: string,
    subtext: string,
    intent: ToastIntent = 'success',
    duration: number = 3000,
  ) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{text}</ToastTitle>
        {subtext && <ToastBody>{subtext}</ToastBody>}
      </Toast>,
      { intent, timeout: duration },
    )
  }

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      <Toaster position="top" /> {/* Fluent UI Toaster */}
    </MessageContext.Provider>
  )
}

// Custom hook to use the context
export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider')
  }
  return context
}
