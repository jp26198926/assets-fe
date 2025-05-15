
import {
  Toast,
  ToastActionElement,
} from "@/components/ui/toast"

export type ToastProps = React.ComponentProps<typeof Toast> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Creating a local store for toasts without relying on context initially
let toastStore = {
  toasts: [] as any[],
  toast: (props: ToastProps) => "",
  dismiss: (id: string) => {},
}

// This will be set when the ToastProvider is initialized
export const setToastStore = (store: typeof toastStore) => {
  toastStore = store
}

export const useToast = () => {
  return {
    toast: (props: ToastProps) => toastStore.toast(props),
    dismiss: (id: string) => toastStore.dismiss(id),
    toasts: toastStore.toasts
  }
}

export const toast = (props: ToastProps) => {
  return toastStore.toast(props)
}

export type { ToastActionElement }
