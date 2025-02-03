export default function Newsletter() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="bg-black text-white rounded-3xl p-12 md:p-16 flex flex-col items-center text-center">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 blur-3xl transform rotate-12"></div>
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 blur-3xl transform -rotate-12"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Bloom Community
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Subscribe to receive exclusive offers, skincare tips, and be the first to know about new product launches.
            </p>

            {/* Form */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Exclusive Offers</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Early Access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Skincare Tips</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 