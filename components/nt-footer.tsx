import Link from "next/link"

export function NTFooter() {
  return (
    <footer className="bg-white text-black py-6 print:hidden border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">Department of Industry, Tourism and Trade</p>
            <p className="text-sm">GPO Box 3000, Darwin NT 0801</p>
            <p className="text-sm mt-2">Phone: (08) 8999 5511</p>
            <p className="text-sm">Email: info.ditt@nt.gov.au</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://nt.gov.au" className="hover:underline">
                  Northern Territory Government
                </Link>
              </li>
              <li>
                <Link href="https://industry.nt.gov.au" className="hover:underline">
                  Department of Industry, Tourism and Trade
                </Link>
              </li>
              <li>
                <Link href="https://nt.gov.au/industry/agriculture" className="hover:underline">
                  Agriculture and Fisheries
                </Link>
              </li>
              <li>
                <Link href="https://nt.gov.au/emergency" className="hover:underline">
                  Emergency Information
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
            <p className="text-sm">
              The information provided in this calculator is intended as a guide only. For official claims, please
              contact the Department of Industry, Tourism and Trade.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="https://nt.gov.au/privacy" className="text-sm hover:underline">
                Copyright
              </Link>
              <Link href="https://nt.gov.au/privacy" className="text-sm hover:underline">
                Privacy
              </Link>
              <Link href="https://nt.gov.au/privacy" className="text-sm hover:underline">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Northern Territory Government of Australia</p>
        </div>
      </div>
    </footer>
  )
}
