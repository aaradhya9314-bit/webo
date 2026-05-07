import { Mail, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const submit = (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    toast.success('Message sent');
  };

  return (
    <div className="container-pad grid gap-8 py-10 lg:grid-cols-[0.8fr_1fr] fade-in">
      <div>
        <p className="text-sm font-bold uppercase text-brand-600">Contact</p>
        <h1 className="mt-2 text-4xl font-extrabold">We would love to help.</h1>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">Reach out for product questions, delivery support, or partnership inquiries.</p>
        <div className="mt-8 grid gap-4 text-sm">
          <p className="flex items-center gap-3"><Mail className="text-brand-600" /> support@luxecart.dev</p>
          <p className="flex items-center gap-3"><Phone className="text-brand-600" /> +1 555 0198</p>
          <p className="flex items-center gap-3"><MapPin className="text-brand-600" /> New York, NY</p>
        </div>
      </div>
      <form onSubmit={submit} className="panel p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field" placeholder="Name" required />
          <input className="field" type="email" placeholder="Email" required />
        </div>
        <input className="field mt-3" placeholder="Subject" required />
        <textarea className="field mt-3 min-h-36" placeholder="Message" required />
        <button className="btn-primary mt-4">Send message</button>
      </form>
    </div>
  );
}

