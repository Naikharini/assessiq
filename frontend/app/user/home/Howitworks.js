"use client";
export default function HowItWorks() {
  return (
    <div className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-12 text-center">How It Works</h2>
      </div>
        <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-cols-4 gap-8">
                <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 flex flex-col items-center">
                    <img src="/Assesment.svg" alt="Create Assessment Icon" className="w-40 h-40 mb-4 items-center justify-center"/>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Create Assessment</h3>
                    <p className="text-gray-600">Easily create assessments by providing your content. Our AI will generate relevant questions based on the information you provide.</p>
                </div>  
                <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 flex flex-col items-center">
                    <img src="/Generate Questions.jpeg" alt="Generate Questions Icon" className="w-40 h-40 mb-4 items-center justify-center"/>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Questions</h3>
                    <p className="text-gray-600">Our AI-powered system will analyze your content and generate high-quality multiple-choice questions in seconds, saving you time and effort.</p>
                </div>  
                <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 flex flex-col items-center">
                    <img src="/TakeAssessment.jpg" alt="Take Assessment Icon" className="w-40 h-40 mb-4 items-center justify-center"/>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Take Assessment</h3>
                    <p className="text-gray-600">Attend assessments anytime, anywhere with a simple and secure platform.Seamless test experience with instant submission and results.</p>
                </div>  
            </div>
        </div>
    </div>
  );
}
 