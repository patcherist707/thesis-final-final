import { Footer } from "flowbite-react";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-400">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8 mt-4 sm:gridl-cols-3 sm:gap-6">
          <div>
            <Footer.Title title="About"/>
            <Footer.LinkGroup col>
              <Footer.Link href="#">
                Credentials
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Social Media"/>
            <Footer.LinkGroup>
              
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Contact Us"/>
            <Footer.LinkGroup col>
              <Footer.Link href="#">
                09388538515
              </Footer.Link>
              <Footer.Link href="#">
                r.adje.463105@umindanao.edu.ph
              </Footer.Link>
              <Footer.Link href="#">
                p.buna.485504@umindanao.edu.ph
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
      </div>
    </Footer>
  );
}