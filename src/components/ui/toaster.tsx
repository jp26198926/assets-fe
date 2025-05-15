
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as ToastPrimitiveProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { createContext, useContext, useState, useEffect } from "react"
import { setToastStore } from "@/hooks/use-toast"

type ToastProviderProps = React.PropsWithChildren<{}>

type ToastActionElement = React.ReactElement

type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => string
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, ...props }])
    
    return id
  }

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  // Set the toast store when the provider is initialized
  useEffect(() => {
    setToastStore({ toasts, toast, dismiss })
  }, [toasts])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastPrimitiveProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose onClick={() => dismiss(id)} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastPrimitiveProvider>
  )
}
