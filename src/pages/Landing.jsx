import { useState } from 'react'

export default function Landing() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cream via-lavender to-medium-purple opacity-40"
          style={{
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 10s ease infinite',
          }}
        ></div>

        {/* Floating organic shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-lavender opacity-20 blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-medium-purple opacity-15 blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-rich-purple opacity-10 blur-3xl animate-float"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* Logo/Brand Name */}
        <h1 className="font-serif text-7xl md:text-8xl font-bold text-deep-plum mb-4">
          Pelora
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-deep-plum mb-12 max-w-md font-light">
          Expert curl care in your pocket.
        </p>

        {/* CTA Button */}
        <button
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform ${
            isHovering ? 'scale-105 shadow-xl' : 'shadow-lg'
          } bg-rich-purple text-cream hover:bg-deep-plum`}
        >
          Start Your Curl Journey
        </button>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-deep-plum text-sm md:text-base">
        <p>Built by Team Pelora | In partnership with United AI</p>
      </footer>
    </div>
  )
}
