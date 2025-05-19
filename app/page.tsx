import { BananaORCCalculator } from "@/components/banana-orc-calculator"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f5] to-[#e5e5e5] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="border-l-4 border-[#1a1e5a] pl-4 mb-6">
            <h1 className="text-3xl font-bold text-[#1a1e5a] mb-2">Owner Reimbursement Costs Calculator</h1>
            <p className="text-gray-600">Northern Territory Department of Industry, Tourism and Trade</p>
          </div>

          <p className="text-gray-700 mb-4 max-w-3xl">
            This official calculator helps determine compensation for crop growers affected by emergency plant pest
            response measures under the Emergency Plant Pest Response Deed (EPPRD) framework.
          </p>

          <div className="bg-[#e6eeff] border border-[#1a1e5a] rounded-lg p-4 mb-8">
            <h2 className="text-lg font-semibold text-[#1a1e5a] mb-2">Important Information</h2>
            <p className="text-sm">
              This calculator provides an estimate only. Official claims must be submitted through the Department of
              Industry, Tourism and Trade. For assistance, please contact the Agriculture and Fisheries Division at (08)
              8999 5511.
            </p>
          </div>
        </div>

        <BananaORCCalculator />
      </div>
    </div>
  )
}
