import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact"
}

const ContactPage = async () => {
  return (
    <div className="w-full h-full">
      <div className="p-3 w-full h-auto max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-gray-600">Get in touch with our team</p>
          </div>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full px-4 py-2 border rounded-lg" placeholder="Your email" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea className="w-full px-4 py-2 border rounded-lg h-32" placeholder="Your message"></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Send Message
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
