
import { Check } from 'lucide-react'

export default function BookingSteps({ currentStep, goToStep }) {
  const steps = [
    { number: 1, name: 'Service' },
    { number: 2, name: 'Date' },
    { number: 3, name: 'Time' },
    { number: 4, name: 'Client' },
    { number: 5, name: 'Confirm' }
  ]

  return (
    <div className="hidden md:flex justify-between">
      {steps.map((step) => {
        // Skip the client step in the display (step 4) but keep the numbering
        if (step.number === 4) return null
        
        const isCompleted = currentStep > step.number
        const isCurrent = currentStep === step.number || 
                          (currentStep === 4 && step.number === 3) || 
                          (currentStep === 5 && step.number === 3) ||
                          (currentStep === 6 && step.number === 5)
        
        return (
          <div key={step.number} className="flex items-center">
            <button 
              onClick={() => goToStep(step.number)}
              disabled={!isCompleted && !isCurrent}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isCompleted 
                  ? 'bg-gold-500 cursor-pointer' 
                  : isCurrent 
                    ? 'bg-gold-500/20 border-2 border-gold-500 text-gold-500' 
                    : 'bg-black-800 border border-black-700 text-gray-500'
              } transition-colors`}
            >
              {isCompleted ? (
                <Check size={20} className="text-black-900" />
              ) : (
                <span className={isCurrent ? 'text-gold-500' : 'text-gray-500'}>
                  {step.number === 5 ? 4 : step.number}
                </span>
              )}
            </button>
            
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                isCompleted || isCurrent ? 'text-white' : 'text-gray-500'
              }`}>
                {step.name}
              </p>
            </div>
            
            {step.number < 5 && (
              <div className={`w-full h-0.5 mx-3 ${
                isCompleted ? 'bg-gold-500' : 'bg-black-700'
              }`}></div>
            )}
          </div>
        )
      })}
    </div>
  )
}
