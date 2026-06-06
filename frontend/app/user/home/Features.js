"use client";
 
export default function Features() {
  return (
    <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">    
            {/* Section Header */ }
            <h2 className="text-3xl font-extrabold text-gray-900 mb-12 text-center"> Features</h2>
        </div>
        {/* Features Grid */ }
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */ }  
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <img src="/chat.png" alt="Question Generation Icon" className="w-30 h-30 mb-4 align-center justify-center"/>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Question Generation</h3>
                    <p className="text-gray-600">Automatically generate high-quality multiple-choice questions based on your content, saving you time and effort.</p>
                </div>  
                {/* Feature 2 */ }
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <img src="/result.png" alt="Analytics Icon" className="w-30 h-30 mb-4 items-center justify-center"/>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Results</h3>
                    <p className="text-gray-600">View assessment results instantly as soon as candidates complete their tests.Get immediate scores, performance insights, and detailed reports without delays.</p>
                </div>  
                {/* Feature 3 */ }
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                   <img src="/EasyToUse.png" alt="Analytics Icon" className="w-30 h-30 mb-4 items-center justify-center"/>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Easy to Use</h3>
                    <p className="text-gray-600">Simple and user-friendly interface designed for everyone.Create assessments, generate questions, and view results with just a few clicks.</p>
                </div>  
            </div>
        </div>
    </div>
  );
};
 