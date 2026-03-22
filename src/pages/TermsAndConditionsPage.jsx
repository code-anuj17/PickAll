import { Link } from "react-router-dom";

export default function TermsAndConditionsPage() {
  return (
    <div className="soft-enter">
      {/* Hero Banner */}
      <section className="brand-gradient overflow-hidden text-white">
        <div className="section-shell flex items-center justify-center" style={{ minHeight: '260px' }}>
          <div className="text-center w-full">
            <h1 className="text-3xl font-bold sm:text-4xl">TERMS & CONDITIONS</h1>
            <p className="mt-4 text-sm text-slate-100/90">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              {" »  "}
              <span className="text-slate-100">Terms & Conditions</span>
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-shell py-14">
        <div className="prose prose-sm max-w-3xl mx-auto text-slate-700">
          <p className="text-sm text-slate-600 mb-8">Effective date: 2024-03-09</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Introduction</h2>
          <p className="mb-6">
            Welcome to <span className="font-semibold">PICKALL LOGISTICS PRIVATE LIMITED</span> ("us", "we", or "our").
          </p>
          <p className="mb-6">
            These Terms and Conditions govern your use of <span className="font-semibold">pickall.in</span> and all related logistics services, features, and functionality (hereinafter referred to as the "<span className="font-semibold">Service</span>").
          </p>
          <p className="mb-6">
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">2. Definitions</h2>
          <div className="space-y-4 mb-8">
            <div>
              <p className="font-semibold">SERVICE</p>
              <p>The PICKALL LOGISTICS PRIVATE LIMITED website and all related services, features, and functionality.</p>
            </div>
            <div>
              <p className="font-semibold">USER</p>
              <p>Any individual or entity that accesses or uses our Service.</p>
            </div>
            <div>
              <p className="font-semibold">VEHICLE TRANSPORTATION SERVICES</p>
              <p>The outbound automobile logistics and land transport support services provided by PICKALL LOGISTICS PRIVATE LIMITED.</p>
            </div>
            <div>
              <p className="font-semibold">CONTENT</p>
              <p>Any information, text, graphics, photos, or other materials uploaded, downloaded, or appearing on the Service.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">3. Service Description</h2>
          <p className="mb-6">
            PICKALL LOGISTICS PRIVATE LIMITED provides land transport support services across India, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li>Outbound auto logistics movement</li>
            <li>Covered carrier and trailer-based transport support</li>
            <li>Corporate fleet relocation</li>
            <li>Real-time GPS shipment tracking</li>
            <li>Observer-based route movement checks</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">4. User Accounts</h2>
          <p className="mb-6">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
          </p>
          <p className="mb-6">
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">5. Booking and Payment Terms</h2>
          <h3 className="text-lg font-bold text-slate-900 mb-4">5.1 Booking Process</h3>
          <p className="mb-4">To book our services:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Provide accurate vehicle and location details</li>
            <li>Accept the quoted price and terms</li>
            <li>Complete payment as per the specified method</li>
            <li>Receive booking confirmation and tracking details</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-900 mb-4">5.2 Payment</h3>
          <p className="mb-6">
            All payments must be made in advance. We accept various payment methods including online payments, bank transfers, and digital wallets. Prices are subject to change without notice.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mb-4">5.3 Cancellation and Refunds</h3>
          <p className="mb-6">
            Cancellation policies vary by service type. Refunds will be processed according to our refund policy, which is communicated at the time of booking.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">6. Service Terms</h2>
          <h3 className="text-lg font-bold text-slate-900 mb-4">6.1 Vehicle Condition</h3>
          <p className="mb-4">By booking our services, you confirm that:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>The vehicle is legally owned by you or you have authorization to transport it</li>
            <li>The vehicle is in roadworthy condition</li>
            <li>All necessary documents are valid and available</li>
            <li>The vehicle is free from hazardous materials</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-900 mb-4">6.2 Insurance and Liability</h3>
          <p className="mb-6">
            While we provide transit insurance, we are not liable for pre-existing damage, mechanical failures, or consequential losses. Users are advised to maintain their own comprehensive insurance coverage.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mb-4">6.3 Delivery Times</h3>
          <p className="mb-6">
            Delivery times are estimates only. We strive for timely delivery but are not liable for delays caused by unforeseen circumstances, weather conditions, or regulatory requirements.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">7. Prohibited Uses</h2>
          <p className="mb-4">You may not use our Service:</p>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
            <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">8. Intellectual Property</h2>
          <p className="mb-6">
            The Service and its original content, features, and functionality are and will remain the exclusive property of PICKALL LOGISTICS PRIVATE LIMITED and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">9. Termination</h2>
          <p className="mb-6">
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p className="mb-6">
            If you wish to terminate your account, you may simply discontinue using the Service.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">10. Limitation of Liability</h2>
          <p className="mb-6">
            In no event shall PICKALL LOGISTICS PRIVATE LIMITED, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">11. Governing Law</h2>
          <p className="mb-6">
            These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">12. Changes to Terms</h2>
          <p className="mb-6">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-10">13. Contact Information</h2>
          <p className="mb-4">If you have any questions about these Terms and Conditions, please contact us at:</p>
          <p className="font-semibold">PICKALL LOGISTICS PRIVATE LIMITED</p>
          <p>Email: Info@pickalllogistics.com</p>
          <p className="text-sm text-slate-600 mt-8">Last updated: March 9, 2024</p>
        </div>
      </section>
    </div>
  );
}
