import Image from "next/image";
import Link from "next/link";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            AI Code Review Assistant
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Automated code analysis powered by AI for your GitHub repositories
          </p>
          <Link 
            href="/repos"
            className="inline-block bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Security Analysis */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:shadow-red-900/20 transition-shadow border border-gray-700">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-3 text-white">Security Threat Analysis</h3>
            <p className="text-gray-300">
              Identify potential security vulnerabilities and threats in your codebase automatically with every push.
            </p>
          </div>

          {/* Architecture Improvements */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:shadow-red-900/20 transition-shadow border border-gray-700">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-xl font-bold mb-3 text-white">Architecture Improvements</h3>
            <p className="text-gray-300">
              Get intelligent suggestions to improve your codebase structure, maintainability, and design patterns.
            </p>
          </div>

          {/* Bug Detection */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:shadow-red-900/20 transition-shadow border border-gray-700">
            <div className="text-4xl mb-4">🐛</div>
            <h3 className="text-xl font-bold mb-3 text-white">Bug & Performance Detection</h3>
            <p className="text-gray-300">
              Discover bugs and performance issues before they impact production with AI-powered analysis.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-800 rounded-lg shadow-md p-8 mb-16 border border-gray-700">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-red-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <h4 className="font-semibold mb-2 text-white">Connect Repository</h4>
              <p className="text-sm text-gray-300">Link your GitHub repository to the assistant</p>
            </div>
            <div className="text-center">
              <div className="bg-red-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h4 className="font-semibold mb-2 text-white">Push Code</h4>
              <p className="text-sm text-gray-300">Make commits and push to your repository</p>
            </div>
            <div className="text-center">
              <div className="bg-red-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <h4 className="font-semibold mb-2 text-white">AI Analysis</h4>
              <p className="text-sm text-gray-300">AI automatically analyzes your code changes</p>
            </div>
            <div className="text-center">
              <div className="bg-red-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                4
              </div>
              <h4 className="font-semibold mb-2 text-white">Get Insights</h4>
              <p className="text-sm text-gray-300">Receive detailed feedback and recommendations</p>
            </div>
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8 text-white">Key Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
              <span className="text-2xl mr-4">⚡</span>
              <div className="text-left">
                <h4 className="font-semibold mb-1 text-white">Real-time Analysis</h4>
                <p className="text-sm text-gray-300">Get instant feedback on every push</p>
              </div>
            </div>
            <div className="flex items-start bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
              <span className="text-2xl mr-4">🎯</span>
              <div className="text-left">
                <h4 className="font-semibold mb-1 text-white">Accurate Detection</h4>
                <p className="text-sm text-gray-300">Powered by advanced AI models</p>
              </div>
            </div>
            <div className="flex items-start bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
              <span className="text-2xl mr-4">📊</span>
              <div className="text-left">
                <h4 className="font-semibold mb-1 text-white">Comprehensive Reports</h4>
                <p className="text-sm text-gray-300">Detailed metrics and insights</p>
              </div>
            </div>
            <div className="flex items-start bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
              <span className="text-2xl mr-4">🔄</span>
              <div className="text-left">
                <h4 className="font-semibold mb-1 text-white">Continuous Monitoring</h4>
                <p className="text-sm text-gray-300">Automated checks with every commit</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white p-12 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to improve your code quality?</h2>
          <p className="text-xl mb-6">Start analyzing your repositories today</p>
          <Link 
            href="/repos"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors border border-red-500"
          >
            View Your Repositories
          </Link>
        </div>
      </div>
    </div>
  );
}