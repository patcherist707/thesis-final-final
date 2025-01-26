import { Footer } from "flowbite-react";

export default function FooterCom() {
  return (
    <div className="sticky z-20">
    <Footer container className="bg-[#4f3e2d] rounded-none">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8 mt-4 sm:gridl-cols-3 sm:gap-6">
          <div>
            <Footer.Title title="About" className="text-[#efede7]"/>
            <Footer.LinkGroup col>
              <Footer.Link href="#" className="text-[#efede7]">
                Credentials
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Social Media" className="text-[#efede7]"/>
            <Footer.LinkGroup>
              
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Contact Us" className="text-[#efede7]"/>
            <Footer.LinkGroup col>
              <Footer.Link href="#" className="text-[#efede7]">
                09388538515
              </Footer.Link>
              <Footer.Link href="#" className="text-[#efede7]">
                r.adje.463105@umindanao.edu.ph
              </Footer.Link>
              <Footer.Link href="#" className="text-[#efede7]">
                p.buna.485504@umindanao.edu.ph
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
      </div>
    </Footer>

    </div>
  );
}