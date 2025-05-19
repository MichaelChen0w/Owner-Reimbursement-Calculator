import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NTHeader() {
  return (
    <header className="w-full bg-[#1a1e5a] text-white print:bg-white print:text-black print:border-b print:border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link href="https://nt.gov.au" className="text-white font-bold text-xl">
                NT.GOV.AU
              </Link>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold">Department of Industry, Tourism and Trade</h1>
              <p className="text-sm">Agriculture and Fisheries Division</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-4 print:hidden">
            <Button variant="ghost" className="text-white hover:bg-[#2d3270]" asChild>
              <Link href="https://nt.gov.au/industry">Industry</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2d3270]" asChild>
              <Link href="https://nt.gov.au/industry/agriculture">Agriculture</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2d3270]" asChild>
              <Link href="https://nt.gov.au/industry/agriculture/farm-management">Farm Management</Link>
            </Button>
          </nav>
          <div className="md:hidden">
            <h1 className="text-lg font-bold">NT DITT</h1>
          </div>
        </div>
      </div>
    </header>
  )
}
