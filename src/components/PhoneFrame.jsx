// Locks the app to a mobile width. On desktop it floats as a phone-sized
// frame on a soft backdrop; on a real phone it fills the screen.
export default function PhoneFrame({ children }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center sm:p-4">
      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-cream shadow-2xl sm:h-[92dvh] sm:max-h-[900px] sm:rounded-[2.5rem] sm:ring-8 sm:ring-ink/80">
        {children}
      </div>
    </div>
  )
}
